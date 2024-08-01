"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import useMainStore from "../../lib/hooks/use-main-store";
import { createProject } from "../../lib/actions";
import { Project } from "../../lib/types";

import { AutosizeTextarea } from "../ui/textarea";
import Editor from "../editor";
import { Input } from "../ui/input";
import { MultiSelect } from "../multi-select";



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

export default function Header() {
  const [loading, setLoading] = useState(false);
  const {
    selectedProject,
    addProject,
    dialog,
    showDialog,
    dragged,
    showDraggedDialog,
    setProjectProperty
  } = useMainStore();

  const frameworksList = [
    { value: "react", label: "React"},
    { value: "angular", label: "Angular"},
    { value: "vue", label: "Vue"},
    { value: "svelte", label: "Svelte" },
    { value: "ember", label: "Ember" },
  ];


//   useEffect(() => {
//     if (selectedProject) {
//         populateProject()
//       form.reset({
//         title: selectedProject.title,
//         description: selectedProject.description,
//         notes: selectedProject.notes!,
//         technologies: selectedProject.technologies!,
//         githuburl: selectedProject.githuburl!,
//         columnId: selectedProject.columnId as ColumnId,
//       });
//     }
//   }, [selectedProject]);

const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["react", "angular"]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values); // Add this line for debugging
    setLoading(true);

    if (dragged) {
      console.log("Saving project, not creating new", values);
      showDialog(false);
      showDraggedDialog(false);
    } else {
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
    }
    setLoading(false);
  }

  return (
    <div className="border border-b-green-100">

      <Input value={selectedProject?.title || ""} 
      placeholder="Title"  
      onChange={(e) => setProjectProperty("title", e.target.value)}
      className="bg-transparent border-0 outline-0 py-8 text-bold text-[40px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
      ></Input>
      
    
      <AutosizeTextarea
      placeholder="description"
      wrap="hard"
      className="bg-transparent border-0 outline-0 text-bold text-md overflow-auto resize-y focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
      value={selectedProject?.description || ""}
      onChange={(e) => setProjectProperty("description", e.target.value)}
      rows={1}
      />

    <div className="flex flex-row px-2">
    <label className="w-1/4 text-gray-500">{"notes"}</label>
      <div className="w-3/4">
      <AutosizeTextarea
      placeholder="notes"
      className="bg-transparent border-0 outline-0 text-bold text-md overflow-auto resize-y hover:bg-[#F3F3F3] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
      value={selectedProject?.notes || ""}
      onChange={(e) => setProjectProperty("notes", e.target.value)}
      />
      </div>
      </div>

      <MultiSelect
        options={frameworksList}
        onValueChange={setSelectedFrameworks}
        defaultValue={selectedFrameworks}
        placeholder="Select frameworks"
        variant="inverted"
        animation={2}
        maxCount={3}
      />
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Selected Frameworks:</h2>
        <ul className="list-disc list-inside">
          {selectedFrameworks.map((framework) => (
            <li key={framework}>{framework}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-row px-2">
      <label className="w-1/4 text-gray-500">{"technologies"}</label>
      <div className="w-3/4">
      <AutosizeTextarea
      placeholder="technologies"
      className="bg-transparent border-0 outline-0 text-bold text-md overflow-auto resize-y hover:bg-[#F3F3F3] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
      value={selectedProject?.technologies || ""}
      onChange={(e) => setProjectProperty("technologies", e.target.value)}
      />
        </div>

    </div>
      <AutosizeTextarea
      placeholder="githuburl"
      className="bg-transparent border-0 outline-0 py-8 text-bold text-md focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
      value={selectedProject?.githuburl || ""}
      onChange={(e) => setProjectProperty("githuburl", e.target.value)}
      />

      
      {/* <Form {...form}>
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
            <Input id="columnId" type="hidden" {...form.register("columnId")} />
          </div>
          <DialogFooter>
            {!loading ? (
              <Button variant={"outline"} className="z-20" type="submit">
                {dragged ? "Save" : "Submit"}
              </Button>
            ) : (
              <ButtonLoading />
            )}
          </DialogFooter>
        </form>
      </Form> */}
    </div>
  );
}
