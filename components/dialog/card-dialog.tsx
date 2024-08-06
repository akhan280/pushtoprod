"use client";

import { IdeasDialog } from "./ideas-dialog";
import useMainStore from "../../lib/hooks/use-main-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Description } from "@radix-ui/react-toast";
import { createProject } from "@/lib/actions";
import { ColumnId } from "../kanban/kanban";
import { ProjectMovement } from "@/lib/hooks/kanban-slice";
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/lib/types";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import Header from "../projects/header";

export default function DialogLayout() {
  const { selectedProject, showDialog, setSelectedProject, dragged, setRequestAdd, requestedAdd, dialog, addProject } = useMainStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleProjectCreation = async (type: string) => {
    setLoading(true);

    const columnId = type as ColumnId;
    const emptyProject: Project = {
      id: uuidv4(),
      title: "Untitled",
      description: "none",
      notes: "none",
      collaborators: [],
      technologies: "none",
      githuburl: "empty",
      columnId: columnId,
    };

    try {
      const result = await createProject(emptyProject);

      if (result.project) {
        const project: ProjectMovement = {
          ...result.project,
          previous: columnId as ColumnId,
          next: columnId as ColumnId,
        };

        addProject(project);
        setSelectedProject(project);
        setRequestAdd("");

        if (type === "development"){
          router.push(`/project/development/${project.id}`);
        }
        else if (type === "to-launch") {
          router.push(`/project/toLaunch/${project.id}`);
        }
       else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to create project.",
          action: <ToastAction altText="Try again" onClick={() => handleProjectCreation(requestedAdd!)}>Try again</ToastAction>,
        });
        console.error("Failed to create project", result.error);
      }
    }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to create project.",
        action: <ToastAction altText="Try again" onClick={() => handleProjectCreation(requestedAdd!)}>Try again</ToastAction>,
      });
      console.error("An error occurred during project creation:", error);
    }
    setLoading(false);
  };

  const dummyPost = {
    id: "post1",
    title: "Dummy Post",
    description: "This is a dummy post",
    content: "Lorem ipsum dolor sit amet",
    slug: "dummy-post",
    image: "https://example.com/image.png",
    imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true,
    siteId: "site1",
    userId: "user1",
    site: {
      id: "site1",
      name: "Dummy Site",
      description: "This is a dummy site",
      logo: "https://example.com/logo.png",
      font: "Arial",
      image: "https://example.com/site-image.png",
      imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
      subdomain: "dummy-site",
      customDomain: "dummy-site.com",
      message404: "Page not found",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
    },
  };

  // const openDialog = () => {
  //   console.log("Opening dialog...");
  //   showDialog(true);
  // };


  console.log('card-dialog', selectedProject, "requestedAdd", requestedAdd, 'dialog', dialog);

  return (
    <div>
      
        {((!selectedProject || !selectedProject.id)) && (
          <Dialog open={dialog} onOpenChange={showDialog}>
            <DialogContent className="bg-white sm:max-w-[425px]">
              <Header partial={true} />
              <DialogHeader>
                <DialogTitle>Add</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
        {(selectedProject?.columnId === "ideas" && (selectedProject?.previous != "development" && selectedProject?.previous != "to-launch")) && (
               <IdeasDialog dummyPost={dummyPost} />    
        )}    
    </div>
  );
}