"use client";
import { useState } from "react";
import useMainStore from "../lib/hooks/use-main-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function AddNewProject() {
  const { setRequestAdd, setSelectedProject, showDialog } = useMainStore();
  const [selectedValue, setSelectedValue] = useState("");

  function handleValueChange(value: string) {
    console.log(`Selected theme: ${value}`);
    showDialog(true);
    setRequestAdd(value);
    setSelectedProject(null);
    setSelectedValue(""); // Reset the select to the initial state
  }

  return (
    <>
      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Add new" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ideas">Ideas</SelectItem>
          <SelectItem value="development">Development</SelectItem>
          <SelectItem value="to-launch">To Launch</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
