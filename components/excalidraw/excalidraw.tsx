"use client"
import dynamic from "next/dynamic";
import useMainStore from "../../lib/hooks/use-main-store";
import initialData from "./initial-data";

const ExcalidrawWithClientOnly = dynamic(
  async () => (await import("./excalidraw-wrapper")).default,
  {
    ssr: false,
  },
);


export function ExcalidrawCanvas() {
  const {selectedProject} = useMainStore();
  console.log('Rendering canvas', selectedProject)
  
    return (
        <div>
          <ExcalidrawWithClientOnly projectId={selectedProject.id} initialData={!selectedProject.excalidrawEditor ? initialData : selectedProject.excalidrawEditor} />
        </div>
    )
  }