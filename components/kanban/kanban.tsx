"use client";
import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./board-column";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { ProjectCard } from "./project-card";
import { coordinateGetter } from "./containers-keyboard-preset";
import { hasDraggableData } from "./utils";
import { Column, Project } from "../../lib/types";
import useMainStore from "../../lib/hooks/use-main-store";
import { updateProjectStatus } from "../../lib/actions";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";


const defaultCols = [
  {id: "ideas" as const, title: "Ideas"},
  {id: "development" as const, title: "Development"},
  {id: "to-launch" as const, title: "Ready to Launch"},
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

interface KanbanBoardProps {
  fetchedProjects: Project[];
}

export function KanbanBoard({ fetchedProjects }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpProjectColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const { selectedProject, setSelectedProject, showDialog, projects, setProjects, dragged, showDraggedDialog } = useMainStore();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const router = useRouter();

  useEffect(() => {
    
    setProjects(fetchedProjects);
    console.log('Projects', fetchedProjects)
  }, [fetchedProjects, setProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 10,
        tolerance: 4,   
      }
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  return (
    
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}onDragOver={onDragOver}>
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns
            .filter((col) => col.id === "development" || col.id === "ideas")
            .map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                projects={projects?.filter((project) => project.columnId === col.id) ?? []}
              />
            ))}
          <div style={{ marginLeft: "80px" }}>
            <BoardColumn
              key="to-launch"
              column={columns.find((col) => col.id === "to-launch")!}
              projects={projects?.filter((project) => project.columnId === "to-launch") ?? []}
            />
          </div>
        </SortableContext>
      </BoardContainer>

      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                projects={projects?.filter(
                  (project) => project.columnId === activeColumn.id
                ) ?? []}
              />
            )}
            {activeProject && <ProjectCard project={activeProject} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Project") {
      console.log('[OnDrag Start] Dragging project')
      setActiveProject(data.project);
      console.log('[OnDrag Start]', activeProject)
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    console.log('[Kanban] Drag end', activeColumn);
    console.log('[Kanban] Drag end', event);

    setActiveColumn(null);
    setActiveProject(null);

    const { active, over } = event;

    if (!over) return;
    if (!over.data || !over.data.current ) return;

    const activeId = active.id;
    const overId = over.id;
    const project = event.active.data.current!.project;
    const previousColumn = pickedUpProjectColumn.current;
    const newColumn = project.columnId;

    if (!newColumn) {
      console.log('[Kanban] newColumn is null; projects', newColumn,  projects);
      const currentProject = projects.find((proj) => proj.id === project.id);
    
      if (currentProject && previousColumn !== null) { currentProject.columnId = previousColumn }
      console.log('[Kanban] newColumn is null; currentProject', currentProject);
    }
    
    console.log('[Kanban] Drag ended on project:', project);
    console.log('[Kanban] Previous Column:', pickedUpProjectColumn.current);
    console.log('[Kanban] New Column:', newColumn);
    
    if (newColumn !== previousColumn ) { showDialog(true) }
    const projectMovement = {next: newColumn, previous: previousColumn, ...project}
    setSelectedProject(projectMovement)

    // TODO: on the current index, it will save to db
    const response = await updateProjectStatus(project.id, newColumn);
    if (response.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }

    if (newColumn === "development" || newColumn === "to-launch") {
      console.log('[On Drag End] Routing to:', `/project/${newColumn}/${project.id}`)
      router.push(`/project/${newColumn}/${project.id}`)
    }

    if (!hasDraggableData(active)) return;
    const activeData = active.data.current;
    if (activeId === overId) return;

    const isActiveAProject = activeData?.type === "Project";
    if (isActiveAProject) {
      const newProjects = projects ? [...projects] : [];
      const activeIndex = newProjects.findIndex((p) => p.id === activeId);
      const overIndex = newProjects.findIndex((p) => p.id === overId);
      const activeProject = newProjects[activeIndex];
      const overProject = newProjects[overIndex];
      
      if (
        activeProject &&
        overProject &&
        activeProject.columnId !== overProject.columnId
      ) {
        activeProject.columnId = overProject.columnId;
        const reorderedProjects = arrayMove(newProjects, activeIndex, overIndex - 1);
        setProjects(reorderedProjects);
      } else {
        const reorderedProjects = arrayMove(newProjects, activeIndex, overIndex);
        setProjects(reorderedProjects);
      }
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveAProject = activeData?.type === "Project";
    const isOverAProject = overData?.type === "Project";

    if (!isActiveAProject) return;

    if (isActiveAProject && isOverAProject) {
      const newProjects = projects ? [...projects] : [];
      const activeIndex = newProjects.findIndex((p) => p.id === activeId);
      const overIndex = newProjects.findIndex((p) => p.id === overId);
      const activeProject = newProjects[activeIndex];
      const overProject = newProjects[overIndex];
      
      if (
        activeProject &&
        overProject &&
        activeProject.columnId !== overProject.columnId
      ) {
        activeProject.columnId = overProject.columnId;
        const reorderedProjects = arrayMove(newProjects, activeIndex, overIndex - 1);
        setProjects(reorderedProjects);
      } else {
        const reorderedProjects = arrayMove(newProjects, activeIndex, overIndex);
        setProjects(reorderedProjects);
      }
    }

    const isOverAColumn = overData?.type === "Column";

    if (isActiveAProject && isOverAColumn) {
      const newProjects = projects ? [...projects] : [];
      const activeIndex = newProjects.findIndex((p) => p.id === activeId);
      const activeProject = newProjects[activeIndex];
      
      if (activeProject) {
        activeProject.columnId = overId as ColumnId;
        setProjects(newProjects);
      }
    }
  }
}
