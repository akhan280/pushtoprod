import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
                <ContextMenuItem key={project.id}>
                  {project.title}
                </ContextMenuItem>
              ))
            ) : (
              <ContextMenuItem>No projects found</ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
      </ContextMenuContent>
    </ContextMenu>
  );
}
