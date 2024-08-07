"use client";
import { useState } from "react";
import useMainStore from "../lib/hooks/use-main-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./plate-ui/button";

export default function AddNewProject() {
  const { setRequestAdd, setSelectedProject, showDialog } = useMainStore();
  const [selectedValue, setSelectedValue] = useState("");

  function handleValueChange() {
    showDialog(true);
    setSelectedProject(null);
    setSelectedValue("");
  }

  return (
    <>
      <Button onClick={handleValueChange}> Add new</Button>
    </>
  );
}
