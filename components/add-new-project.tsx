"use client";
import { useState } from "react";
import useMainStore from "../lib/hooks/use-main-store";
import { Button } from "./ui/button";


export default function AddNewProject() {
  const { setRequestAdd, setSelectedProject, showDialog } = useMainStore();
  const [selectedValue, setSelectedValue] = useState("");

  function handleValueChange() {
    // PopulateSupabase();
    showDialog(true);
    setSelectedValue("");
  }

  return (
    <>
      <Button onClick={handleValueChange} className="max-w-md rounded-full"> Add new project</Button>
    </>
  );
}
