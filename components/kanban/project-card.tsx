"use client"

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { CheckCheck, ExpandIcon, GripVertical } from "lucide-react";
import { ColumnId } from "./kanban";
import { Badge } from "../ui/badge";
import { Project } from "../../lib/types";
import useMainStore from "../../lib/hooks/use-main-store";
import {useRouter} from "next/navigation";


export type ProjectType = "Project";
export interface ProjectDragData {
  type: ProjectType;
  project: Project;
}

interface ProjectCardProps {
  project: Project;
  isOverlay?: boolean;
  column: any;
}

export function ProjectCard({ project, column, isOverlay }: ProjectCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: {
      type: "Project",
      project,
    } satisfies ProjectDragData,
    attributes: {
      roleDescription: "Project",
    },
  });

  const {showDialog, setSelectedProject} = useMainStore();
  const router = useRouter();
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const onProjectClick = (project: Project) => {
    if (project.columnId === "development" || project.columnId === "to-launch") {
      console.log('[On Drag End] Routing to:', `/project/${project.columnId}/${project.id}`);
      router.push(`/project/${project.columnId}/${project.id}`);
    }
  };

  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {setSelectedProject({...project, previous: column, next: column}), onProjectClick(project)}}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row justify-center border-b-2 border-secondary relative">
        <ExpandIcon></ExpandIcon>
        <div>hi</div>
        <Badge variant={"outline"} className="ml-auto font-semibold">
          Project
        </Badge>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        {project.title}
      </CardContent>
    </Card>
  );
}