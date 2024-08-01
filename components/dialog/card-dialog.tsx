"use client";
import { IdeasDialog } from "./ideas-dialog";
import useMainStore from "../../lib/hooks/use-main-store";
import { DevelopmentDialog } from "./development-dialog";
import { LaunchDialog } from "./launch-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Description } from "@radix-ui/react-toast";
import { createProject } from "@/lib/actions";
import { ColumnId } from "../kanban/kanban";
import { ProjectMovement } from "@/lib/hooks/kanban-slice";
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/lib/types";

export default function DialogLayout() {
  const { selectedProject, setSelectedProject, setRequestAdd, requestedAdd, dialog, addProject } = useMainStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  


  const handleProjectCreation = async (type: string) => {
    setLoading(true);
  
      const columnId = type as ColumnId;
  
      const projectData: Project = {
        id: uuidv4(),
        title: "Untitled",
        description: "none",
        notes: "none", 
        collaborators: [],
        technologies: "none", 
        githuburl: "empty", 
        columnId: columnId,
      };
     
      console.log(`new proj is ${projectData}`)
      const result = await createProject(projectData);
      console.log("PROJECT awaiting:", result.project?.id)

      try{
        if (result.project) {
          const project: ProjectMovement = {
            ...result.project,
            previous: columnId as ColumnId, 
            next: columnId as ColumnId,
          };

          addProject(project);
          setSelectedProject(project);
          setRequestAdd(""); 

          console.log("PROJECT CREATED:", project?.id)

          router.push(`/project/${type}/${project?.id}`);
        }
        else {
          console.error("Failed to create project", result.error);
        }
      }
      catch(error){
        console.error("An error occurred during project creation:", error);

      }
      setLoading(false);
    
  };

  if (requestedAdd && !selectedProject && !loading) {
    handleProjectCreation(requestedAdd);
  }


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

  console.log('card-dialog', selectedProject, "requestedAdd", requestedAdd, 'dialog', dialog);

  useEffect(() => {
    if (requestedAdd === "development") {
      // Redirect to the new project route
      router.push(`/project/development/${selectedProject?.id}`);
    } else if (requestedAdd === "to-launch") {
      // Redirect to the launch page or handle accordingly
      router.push(`/project/to-launch/${selectedProject?.id}`);
    } else if (requestedAdd === "ideas") {
      // Redirect to the ideas page or handle accordingly
      router.push(`/project/ideas/${selectedProject?.id}`);
    }
  }, [requestedAdd, selectedProject, router]);


  return (
    <div>

      {(requestedAdd === "to-launch" || 
        (selectedProject?.columnId === "to-launch")
      ) && (
        <div>
          <LaunchDialog dummyPost={dummyPost} />
        </div>
      )}


      {(requestedAdd === "development" || 
        (selectedProject?.columnId === "development" && 
        selectedProject.previous !== "to-launch")
      ) && (
        <div>
          <DevelopmentDialog dummyPost={dummyPost} />
        </div>
      )}

      {(requestedAdd === "ideas" || 
        (selectedProject?.columnId === "ideas" && 
        selectedProject.previous !== "development" && 
        selectedProject.previous !== "to-launch")
      ) && (
        <div>
          <IdeasDialog dummyPost={dummyPost} />
        </div>
      )}

    </div>
  );
}
