"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { CheckCheck, ExpandIcon, GripVertical } from "lucide-react";
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
  const {setNodeRef, attributes, listeners, transform, transition, isDragging, } = useSortable({
    id: project.id,
    data: {
      type: "Project",
      project,
    } satisfies ProjectDragData,
    attributes: {
      roleDescription: "Project",
    },
  });

  const {showDialog, setSelectedProject, setRequestAdd, requestedAdd, loading, setLoading} = useMainStore();
  const router = useRouter();
  const style = {transition, transform: CSS.Translate.toString(transform)};
  const variants = cva("", {variants: {dragging: {over: "ring-2 opacity-30", overlay: "ring-2 ring-primary"}}});

  const onProjectClick = (project: Project) => {
    setLoading(true)
    setSelectedProject({...project, previous: column, next: column})
    if (project.columnId === "development" || project.columnId === "to-launch") {
      console.log('[On Drag End] Routing to:', `/project/${project.columnId}/${project.id}`);
      const route = project.columnId === "to-launch" ? `/project/toLaunch/${project.id}` : `/project/${project.columnId}/${project.id}`;
      router.push(route);
    }
    setRequestAdd("ideas")
    setLoading(false);
    showDialog(true);
  };
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {onProjectClick(project)}}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap outline-blue-500">
        <Badge variant={"outline"} className="ml-auto font-semibold">
          Project
        </Badge>
      </CardContent>
      <CardHeader className="px-3 py-3 flex flex-col border-secondary relative">
        <div className="text-lg">{project.title}</div>
        <div className="text-sm text-zinc-600">{project.description}</div>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        collaborators
      </CardContent>
    </Card>
  );
}