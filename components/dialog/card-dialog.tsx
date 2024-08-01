"use client";
import { IdeasDialog } from "./ideas-dialog";
import useMainStore from "../../lib/hooks/use-main-store";
import { DevelopmentDialog } from "./development-dialog";
import { LaunchDialog } from "./launch-dialog";

export default function DialogLayout() {
  const { selectedProject, requestedAdd, dialog } = useMainStore();

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
