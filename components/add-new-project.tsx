"use client";
import { useState } from "react";
import useMainStore from "../lib/hooks/use-main-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { PopulateSupabase } from "../lib/actions";


export default function AddNewProject() {
  const { setRequestAdd, setSelectedProject, showDialog } = useMainStore();
  const [selectedValue, setSelectedValue] = useState("");

  function handleValueChange() {
    // PopulateSupabase();
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
