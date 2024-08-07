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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Header from "../projects/header";
import Image from "next/image";
import { ButtonLoading } from "../ui/button-loading";

export default function DialogLayout() {
  const {
    selectedProject,
    showDialog,
    setSelectedProject,
    dragged,
    setRequestAdd,
    requestedAdd,
    dialog,
    addProject,
  } = useMainStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const dummyPost = {id: "post1", title: "Dummy Post", description: "This is a dummy post", content: "Lorem ipsum dolor sit amet",  slug: "dummy-post", image: "https://example.com/image.png", imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
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

  return (
    <div>
      {(!selectedProject || !selectedProject.id) && (
        <Dialog open={dialog} onOpenChange={showDialog}>
          <DialogContent className="bg-white sm:max-w-[420px] ">
            {/* <Header partial={true} /> */}
            {loading ? (
              <ButtonLoading></ButtonLoading>
            ) : (
              <>
                <Image
                  height={30}
                  width={410}
                  loading="eager"
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/ideas.png"
                  alt="ideas"
                  className="rounded-3xl transition-all duration-300 hover:opacity-90 hover:ring-1 hover:ring-black/30 hover:ring-offset-1"
                  onClick={() => {

                    setLoading(true);
                    setRequestAdd("ideas");
                    setLoading(false);
                    
                  }}
                />
                <Image
                  height={30}
                  width={410}
                  loading="eager"
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/development.png"
                  alt="development"
                  className="rounded-3xl transition-all duration-300 hover:opacity-90 hover:ring-1 hover:ring-black/30 hover:ring-offset-1"
                  onClick = { async () => {

                    setLoading(true);
                    console.log("Image rendering");
                    const data = await createProject({title: "Untitled", description: "Description", collaborators: [], technologies: "",  githuburl: "",  columnId: "development", tags: [], websiteurl: ""});
                    console.log("Data returned", data);
                    router.push(`/project/development/${data.project?.id}`);
                    setLoading(false);

                  }}
                />
                <Image
                  height={30}
                  width={410}
                  loading="eager"
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/launch.png"
                  alt="launch"
                  className="rounded-3xl transition-all duration-300 hover:opacity-90 hover:ring-1 hover:ring-black/30 hover:ring-offset-1"
                  onClick={async () => {

                    setLoading(true);
                    console.log("Image rendering");
                    const data = await createProject({title: "Untitled", description: "Description", collaborators: [], technologies: "", githuburl: "", columnId: "development", tags: [], websiteurl: ""});
                    console.log("Data returned", data);
                    router.push(`/project/toLaunch/${data.project?.id}`);
                    setLoading(false);

                  }}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
      {(requestedAdd === "ideas" || selectedProject?.columnId === "ideas") && <IdeasDialog dummyPost={dummyPost} />}
    </div>
  );
}
