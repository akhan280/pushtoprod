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
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import TagProperty from "./properties/tag-property";


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

export default function Header({ partial }: { partial: boolean }) {
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


  return (
    partial ?
      (
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

          <AutosizeTextarea
            placeholder="githuburl"
            className="bg-transparent border-0 outline-0 py-8 text-bold text-md focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
            value={selectedProject?.githuburl || ""}
            onChange={(e) => setProjectProperty("githuburl", e.target.value)}
          />
        </div>
      )
      :
      (
        <div className="container mx-auto p-4">
  <div className="mb-4">
    <Input
      value={selectedProject?.title || ""}
      placeholder="Title"
      onChange={(e) => setProjectProperty("title", e.target.value)}
      className="w-full bg-transparent border-0 outline-none py-2 text-4xl font-bold text-black focus:ring-0"
    />
  </div>

  <div className="mb-4">
    <AutosizeTextarea
      placeholder="Description"
      className="w-full bg-transparent border-0 outline-none text-md text-gray-700 focus:ring-0"
      value={selectedProject?.description || ""}
      onChange={(e) => setProjectProperty("description", e.target.value)}
      rows={4}
    />
  </div>

  <hr className="border-t border-gray-300" />
</div>
      )
  );
}
