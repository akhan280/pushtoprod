"use client"
import { useMemo, useRef, useState } from "react";
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
import { getProjects } from "./getKanban";


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



export async function KanbanBoard(fetchedProjects: any) {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpProjectColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // const [tasks, setTasks] = useState<Project[]>(initialTasks);

  const {projects, setProjects} = useMainStore();
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  // const [activeTask, setActiveTask] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  

  setProjects(fetchedProjects)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTaskData(projectId: UniqueIdentifier, columnId: ColumnId) {
    // const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const projectsInColumn = projects.filter((project) => project.columnId === columnId);
    // const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
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
        
        console.log(`Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`);

        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Project") {
        pickedUpProjectColumn.current = active.data.current.project.columnId;
        const { projectsInColumn, projectPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpProjectColumn.current!
        );
        console.log(
          `Picked up Project ${
          active.data.current.task.content
        } at position: ${projectPosition + 1} of ${
          projectsInColumn.length
        } in column ${column?.title}`
        )
        return `Picked up Project ${
          active.data.current.project.content
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
        console.log(
          `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`

        )
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Project" &&
        over.data.current?.type === "Project"
      ) {
        const { projectsInColumn, projectPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.project.columnId
        );
        if (over.data.current.project.columnId !== pickedUpProjectColumn.current) {
          console.log(
            `Project ${
            active.data.current.project.content
          } was moved over column ${column?.title} in position ${
            projectPosition + 1
          } of ${projectsInColumn.length}`
            )
          console.log(`Task ${
            active.data.current.project.content
          } was moved over column ${column?.title} in position ${
            projectPosition + 1
          } of ${projectsInColumn.length}`)
          return `Task ${
            active.data.current.project.content
          } was moved over column ${column?.title} in position ${
            projectPosition + 1
          } of ${projectsInColumn.length}`;
        }
        console.log(`Task was moved over position ${projectPosition + 1} of ${
          projectsInColumn.length
        } in column ${column?.title}`)
        return `Task was moved over position ${projectPosition + 1} of ${
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
        console.log(`Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length}`)
        
        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Project" &&
        over.data.current?.type === "Project"
      ) {
        const { projectsInColumn, projectPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.project.columnId
        );
        if (over.data.current.project.columnId !== pickedUpProjectColumn.current) {

        console.log(`Project was dropped into column ${column?.title} in position ${
          projectPosition + 1
        } of ${projectsInColumn.length}`)

          return `Projects was dropped into column ${column?.title} in position ${
            projectPosition + 1
          } of ${projectsInColumn.length}`;
        }

        console.log(`Task was dropped into position ${projectPosition + 1} of ${
          projectsInColumn.length
        } in column ${column?.title}`)
        
        return `Task was dropped into position ${projectPosition + 1} of ${
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
                projects={projects.filter((project) => project.columnId === col.id)}
              />
            ))}
          <div style={{ marginLeft: "80px" }}>
            <BoardColumn
              key="to-launch"
              column={columns.find((col) => col.id === "to-launch")!}
              projects={projects.filter((project) => project.columnId === "to-launch")}
            />
          </div>
        </SortableContext>
      </BoardContainer>

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                projects={projects.filter(
                  (project) => project.columnId === activeColumn.id
                )}
              />
            )}
            {/* {activeTask && <TaskCard task={activeTask} isOverlay />} */}
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

    if (data?.type === "Task") {
      setActiveProject(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveProject(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
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

    // const isActiveATask = activeData?.type === "Task";
    // const isOverATask = overData?.type === "";

    const isActiveAProject = activeData?.type === "Project";
    const isOverAProject = overData?.type === "";

    

    if (!isActiveAProject) return;

    // Im dropping a Task over another Task
    if (isActiveAProject && isOverAProject) {
      const newProjects = [...projects];
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

    // Im dropping a Task over a column
    if (isActiveAProject && isOverAColumn) {
      const newProjects = [...projects];
      const activeIndex = newProjects.findIndex((p) => p.id === activeId);
      const activeProject = newProjects[activeIndex];
      
      if (activeProject) {
        activeProject.columnId = overId as ColumnId;
        setProjects(newProjects);
      }
    }
  }  
}