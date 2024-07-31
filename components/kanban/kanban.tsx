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
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { ProjectCard } from "./project-card";
import { coordinateGetter } from "./containers-keyboard-preset";
import { hasDraggableData } from "./utils";
import { Column, Project } from "../../lib/types";
import useMainStore from "../../lib/hooks/use-main-store";
import { AddDialog } from "./card-dialog";
import { updateProjectStatus } from "../../lib/actions";
import { toast } from "../ui/use-toast";


const defaultCols = [
  {
    id: "ideas" as const,
    title: "Ideas",
  },
  {
    id: "development" as const,
    title: "Development",
  },
  {
    id: "to-launch" as const,
    title: "Ready to Launch",
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

interface KanbanBoardProps {
  fetchedProjects: Project[];
}

export function KanbanBoard({ fetchedProjects }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpProjectColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const { setSelectedProject, showDialog, projects, setProjects, dragged, showDraggedDialog } = useMainStore();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    
    setProjects(fetchedProjects);
    console.log('projecst', fetchedProjects)
  }, [fetchedProjects, setProjects]);
  // useEffect(() => {
  //   async function fetchProjects() {
  //     const proj = await KanbanFetcher();
  //     setProjects(proj);
  //     console.log('projects', projects);
  //   }

  //   fetchProjects();
  // }, [setProjects]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  
  function getDraggingProjectData(projectId: UniqueIdentifier, columnId: ColumnId) {
    const projectsInColumn = projects?.filter((project) => project.columnId === columnId) ?? [];
    const projectPosition = projectsInColumn.findIndex((project) => project.id === projectId);
    const column = columns.find((col) => col.id === columnId);
    return {
      projectsInColumn,
      projectPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Project") {
        pickedUpProjectColumn.current = active.data.current.project.columnId;
        const { projectsInColumn, projectPosition, column } = getDraggingProjectData(
          active.id,
          pickedUpProjectColumn.current!
        );
        return `Picked up Project ${
          active.data.current.project.title
        } at position: ${projectPosition + 1} of ${
          projectsInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Project" &&
        over.data.current?.type === "Project"
      ) {
        const { projectsInColumn, projectPosition, column } = getDraggingProjectData(
          over.id,
          over.data.current.project.columnId
        );
        if (over.data.current.project.columnId !== pickedUpProjectColumn.current) {
          return `Project ${
            active.data.current.project.title
          } was moved over column ${column?.title} in position ${
            projectPosition + 1
          } of ${projectsInColumn.length}`;
        }
        return `Project was moved over position ${projectPosition + 1} of ${
          projectsInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpProjectColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);
        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Project" &&
        over.data.current?.type === "Project"
      ) {
        const { projectsInColumn, projectPosition, column } = getDraggingProjectData(
          over.id,
          over.data.current.project.columnId
        );
        if (over.data.current.project.columnId !== pickedUpProjectColumn.current) {
          return `Project was dropped into column ${column?.title} in position ${
            projectPosition + 1
          } of ${projectsInColumn.length}`;
        }

        return `Project was dropped into position ${projectPosition + 1} of ${
          projectsInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpProjectColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpProjectColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
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
        <AddDialog></AddDialog>

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
    console.log(hasDraggableData(event.active))
    if (!hasDraggableData(event.active)) return;
    
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    console.log('data type', data?.type)
    if (data?.type === "Project") {
      console.log('Dragging project')
      setActiveProject(data.project);
      return;
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveProject(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const project = event.active.data.current!.project;
    const previousColumn = pickedUpProjectColumn.current;
    const newColumn = over.data.current!.project.columnId;
    console.log('[Kanban] Drag ended on project:', project)
    console.log('[Kanban] Previous Column:', pickedUpProjectColumn.current)
    console.log('[Kanban] New Column:', over.data.current!.project.columnId)

    // 2) 
    // if (previousColumn === "to-launch" && newColumn === "development" || previousColumn === "to-launch" && newColumn === "ideas"|| previousColumn === "development" && newColumn === "ideas"){
    //   showDialog(false)
    // }
    
    if (newColumn !== previousColumn ) {
        showDialog(true)
        showDraggedDialog(true)
    }
    // else{
    //   showDialog(true)
    // }

    if (previousColumn === "ideas" && newColumn === "development"){
      showDialog(true)
      showDraggedDialog(true)
    }
    else if (previousColumn === "development" && newColumn === "to-launch"){
      showDialog(true)
      showDraggedDialog(true)
    }
    else if (previousColumn === "ideas" && newColumn === "to-launch"){
      showDialog(true)
      showDraggedDialog(true)
    }
    else{
      showDialog(false)
      showDraggedDialog(false)
      
    }
      
      
      
    
    
    

    
    
    const projectMovement = { 
      next: over.data.current!.project.columnId,
      previous: pickedUpProjectColumn.current,
      ...project,
    }

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
