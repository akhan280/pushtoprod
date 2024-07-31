"use client"

import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "./board-column";
import { ProjectDragData } from "./project-card";

type DraggableData = ColumnDragData | ProjectDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Project") {
    return true;
  }

  return false;
}