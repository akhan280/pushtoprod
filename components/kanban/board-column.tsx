
"use client"
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Column, Project } from "../../lib/types";
import { ProjectCard } from "./project-card";
import useMainStore from "../../lib/hooks/use-main-store";

export type ColumnType = "Column";
export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  projects: Project[];
  isOverlay?: boolean;
}


export function BoardColumn({ column, projects, isOverlay }: BoardColumnProps) {
  const projectsIds = useMemo(() => {
    return projects?.map((projects) => projects.id);
  }, [projects]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[450px] min-h-full w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  const {showDialog} = useMainStore();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <span className="mr-auto"> {column.title}</span>
        <Button onClick ={() => showDialog(true)} variant="outline">Add {column.title}</Button>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={projectsIds}>
            {projects?.map((projects) => (
              <ProjectCard key={projects.id} project={projects} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}