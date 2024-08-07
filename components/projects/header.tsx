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
        <div className = "mt-8">
          <Card className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full">invite collaborators</Button>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">AK</div>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">AN</div>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">An App to Enable People to Push Code</h1>

            <p className="text-gray-600 mb-6">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

            <div className="flex items-center space-x-2 mb-6">
              <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Urgent</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Feature</span>
              <button className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">+</button>
            </div>

            <div className="flex space-x-4 mb-8">
              <button className="flex items-center space-x-2 text-gray-700">
                <img src="github-icon.svg" alt="GitHub" className="w-5 h-5" />
                <span className="text-sm">Link GitHub</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700">
                <img src="link-icon.svg" alt="Link" className="w-5 h-5" />
                <span className="text-sm">Link Website</span>
              </button>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Technologies</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Example of technology item */}
                <div className="flex items-center space-x-2">
                  <img src="github-icon.svg" alt="GitHub" className="w-6 h-6" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">GitHub</span>
                    <span className="text-xs text-gray-500">Link Pull requests, commits and automate workflows</span>
                  </div>
                </div>
                {/* Repeat similar blocks for other technologies */}
              </div>
            </div>
          </Card>
        </div>
      )
  );
}
