
"use client"
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Column, Project } from "../../lib/types";
import { ProjectCard } from "./project-card";
import { createProject } from "@/lib/actions";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


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
    "h-[450px] min-h-screen w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        {/* <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button> */}
        <span className="mr-auto"> {column.title}</span>
        <AddDialog column={column.id}></AddDialog>
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

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  notes: z.string().optional(),
  technologies: z.string().optional(),
  githuburl: z.string().optional(),
  columnId: z.string().min(1, {
    message: "Column ID must be specified.",
  }),
});


export function AddDialog({column}: {column: UniqueIdentifier}) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      notes: "",
      technologies: "",
      githuburl: "",
      columnId: column,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createProject(values);

    if (result.error) {
      console.error("Error creating project:", result.error);
    } else {
      console.log("Project created:", result.project);
    }
  }
  
  console.log('adding', column)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add {column}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
      
      {column === "ideas" && (
        <div>
          Fill in with ideas
        </div>
        )
      }
       {column === "development" && (
        <div>
          Fill in with development
        </div>
        )
      }
       {column === "to-launch" && (
        <div>
          Fill in with to-launch shit
        </div>
        )
      }
        <DialogHeader>
          <DialogTitle>Add {column}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div> */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                {...form.register("description")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input id="notes" {...form.register("notes")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="technologies" className="text-right">
                Technologies
              </Label>
              <Input
                id="technologies"
                {...form.register("technologies")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="githuburl" className="text-right">
                GitHub URL
              </Label>
              <Input
                id="githuburl"
                {...form.register("githuburl")}
                className="col-span-3"
              />
            </div>
            <Input
              id="columnId"
              type="hidden"
              {...form.register("columnId")}
              value={column}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
