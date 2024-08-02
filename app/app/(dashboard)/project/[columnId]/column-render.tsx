"use client";

import { useEffect, useState } from "react";
import useMainStore from "../../../../../lib/hooks/use-main-store";
import { getSingularProject } from "../../../../../lib/actions";
import { ProjectMovement } from "@/lib/hooks/kanban-slice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../../../components/ui/breadcrumb";
import Header from "../../../../../components/dialog/header";
import Editor from "../../../../../components/editor";

export default function ColumnRender({ columnId }: { columnId: string}) {
    const segment = columnId
    const { selectedProject, setSelectedProject } = useMainStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
  
      const fetchProject = async () => {
        try {
            const data = await getSingularProject(segment);
            if (data?.error) {
                setError('An error occurred while fetching the project');
            } else if (data?.project) {
                const projectMovement: ProjectMovement = {
                    ...data.project,
                    previous: data.project.columnId,
                    next: data.project.columnId,
                };
                setSelectedProject(projectMovement);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
      };

      if (!selectedProject || !selectedProject.id) {
          console.log('')
          fetchProject();
      } else {
          setLoading(false);
      }
    }, [selectedProject, setSelectedProject]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const dummyPost = {
        id: "post1",
        title: "Dummy Post",
        description: "gg is a dummy post",
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

    return (
        <div className="flex flex-col justify-center items-center place-items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">areebkhan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedProject?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Header />
        
        {/* <Editor post={dummyPost} /> */}
      </div>
    );
}
