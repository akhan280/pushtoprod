"use client";
import { useEffect, useState } from "react";
import { Section, SiteProjects } from "../../components/site/site-interfaces";
import { getMultipleProjects } from "../../lib/site-actions";
import { Plate, Value } from "@udecode/plate-common";
import { plugins } from "../../plateconfig";
import { Editor } from "../../components/ui/plate-ui/editor";

export default function ProjectsDisplay({ section, domain }: { section: Section, domain: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [allProjects, setProjects] = useState<{ id: string; title: string; description: string; columnId: string; display: boolean | null }[]>([]);

  useEffect(() => {
    const initializeData = async () => {
    //   console.log("[ProjectsDisplay] Initialization started");

      // Setting loading state to true
      setIsLoading(true);
    //   console.log("[ProjectsDisplay] Loading state set to true");

      // Extracting project content from the section
    //   console.log("[ProjectsDisplay] section:", section);

      const content = (section.content as { projects: SiteProjects });
    //   console.log("[ProjectsDisplay] Extracted content from section:", content);

      // Flattening all project IDs into a single array
      const allIds = Object.values(content).flatMap(projectIds => projectIds ?? []);
      console.log("[ProjectsDisplay] Flattened all project IDs:", allIds);

      // Fetching projects based on IDs
      const { projects, hiddenProjectsCount, error } = await getMultipleProjects(allIds as string[], domain);

      if (error) {
        console.error("[ProjectsDisplay] Error fetching projects:", error);
      } else {
        console.log("[ProjectsDisplay] Fetched projects:", projects);
        console.log("[ProjectsDisplay] Hidden projects count:", hiddenProjectsCount);
      }

      // Setting the fetched projects in state
      console.log("[ProjectsDisplay] Return from getMultiplteProjects:", projects);

      setProjects(projects);
      console.log("[ProjectsDisplay] Projects state updated:", projects);

      // Setting loading state to false
      setIsLoading(false);
      console.log("[ProjectsDisplay] Loading state set to false");
    };

    initializeData();
  }, [section]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderProjectsForSection = (columnId: string) => {
    console.log(`[ProjectsDisplay] Rendering projects for section: ${columnId}`);

    // Filtering projects based on column ID and display status
    const columnProjects = allProjects.filter(project => project.columnId === columnId && project.display);
    console.log(`[ProjectsDisplay] Filtered projects for ${columnId}:`, columnProjects);

    return (
      <div className="flex flex-row">
        {columnProjects.map((project, index) => (
          <div key={index}>
            <strong>Title:</strong> {project.title}
            <br />
            <strong>Description:</strong> {project.description}
          </div>
        ))}
      </div>
    );
  };

  console.log("[ProjectsDisplay] Rendering all projects by section");

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3">
        {allProjects.map(project => (
          <div key={project.columnId}>
            {renderProjectsForSection(project.columnId)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SitePlateEditor({ content }: { content: string }) {
  const deserializedInitialValue: Value = JSON.parse(content);
  console.log("[SitePlateEditor] Deserialized content for editor:", deserializedInitialValue);

  return (
    <Plate plugins={plugins} initialValue={deserializedInitialValue} readOnly={true}>
      <Editor />
    </Plate>
  );
}