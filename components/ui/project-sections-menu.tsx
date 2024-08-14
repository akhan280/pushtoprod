
import React, { useState, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { updateDisplay } from "@/lib/site-actions";

type Project = {
  id: string;
  title: string;
  description: string;
  display: boolean;
};

type ProjectContextMenuProps = {
  columnId: string;
  projects: Project[];
};

export function ProjectContextMenu({ columnId, projects }: ProjectContextMenuProps) {

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Initialize the checkedItems state based on the project data
  useEffect(() => {
    const initialCheckedItems = projects.reduce((acc, project) => {
      acc[project.id] = project.display;
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(initialCheckedItems);
  }, [projects]);

  const handleCheckboxChange = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const newDisplayState = !project.display;

      // Optimistically update the local state
      setCheckedItems((prev) => ({
        ...prev,
        [projectId]: newDisplayState,
      }));

      try {
        // Push the update to the database
        const result = await updateDisplay(projectId, newDisplayState);
        if (result.error) {
          console.error("Failed to update project display in database", result.error);
          // Optionally revert the local state if the update fails
          setCheckedItems((prev) => ({
            ...prev,
            [projectId]: project.display,
          }));
        } else {
          // If the update is successful, ensure the local project state reflects the change
          project.display = newDisplayState;
        }
      } catch (error) {
        console.error("Unexpected error while updating project display", error);
        // Optionally revert the local state if the update fails
        setCheckedItems((prev) => ({
          ...prev,
          [projectId]: project.display,
        }));
      }
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>{columnId}</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ContextMenuCheckboxItem
                  key={project.id}
                  checked={checkedItems[project.id]}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={() => handleCheckboxChange(project.id)}
                >
                  {project.title}
                </ContextMenuCheckboxItem>
              ))


            ) : (
              <ContextMenuCheckboxItem>No projects found</ContextMenuCheckboxItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
      </ContextMenuContent>
    </ContextMenu>
  );
}
