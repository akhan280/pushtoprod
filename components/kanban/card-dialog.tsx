import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import useMainStore from "../../lib/hooks/use-main-store";
import { createProject } from "../../lib/actions";
import { Project } from "../../lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/button-loading";

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
    columnId: z.enum(["ideas", "development", "to-launch"]),
});
  
type ColumnId = "ideas" | "development" | "to-launch";
  
export function AddDialog() {

    const [loading, setLoading] = useState(false);
    const { selectedProject, addProject, dialog, showDialog } = useMainStore();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description: "",
        notes: "",
        technologies: "",
        githuburl: "",
        columnId: "ideas",  // Set a valid default value
      },
    });

    useEffect(() => {
        if (selectedProject) {
            form.reset({
                title: selectedProject.title,
                description: selectedProject.description,
                notes: selectedProject.notes!,
                technologies: selectedProject.technologies!,
                githuburl: selectedProject.githuburl!,
                columnId: selectedProject.columnId as ColumnId,
            });
        }
    }, [selectedProject, form]);
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log("Form values:", values); // Add this line for debugging 
      setLoading(true)
      const newProject: Project = {
        id: uuidv4(),
        ...values,
      };
      const result = await createProject(newProject);
      if (result.error) {
        console.error("Error creating project:", result.error);
      } else {
        console.log("Project created:", result.project);
        addProject(newProject);
        showDialog(false);
      }
      setLoading(false)
    }
  
    return (
      // if dialog == true, we open
      <Dialog open={dialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Add</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
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
                  <Input
                    id="notes"
                    {...form.register("notes")}
                    className="col-span-3"
                  />
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
                />
              </div>
              <DialogFooter>
                {!loading ? <Button variant={"outline"} className="z-20" type="submit">
                  Submit
                </Button>: <ButtonLoading />}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
}
