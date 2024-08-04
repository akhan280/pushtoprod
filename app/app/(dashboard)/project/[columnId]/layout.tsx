"use server";
import Sidebar from "@/components/projects/sidebar";
import { PlateEditor } from "@/components/projects/plate-editor";
import ColumnRender from "./column-render";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default async function ProjectLayout({
  ideas,
  development,
  "to-launch": toLaunch,
  params,
}: {
  ideas: React.ReactNode;
  development: React.ReactNode;
  "to-launch": React.ReactNode;
  params: { columnId: string };
}) {
  const { columnId } = params;

  if (!columnId) {
    throw "No column found";
  }

  console.log("Rendering the ProjectLayout");

  return (
    
    <div className="flex">

      <div className="flex-1 p-4">
        {columnId === "ideas" && ideas}
        {columnId === "development" && development}
        {columnId === "to-launch" && toLaunch}
        <PlateEditor></PlateEditor>

        
        
      </div>
      


      <div className="w-100">
        <Sidebar />     
      </div>

    </div>
  );
}