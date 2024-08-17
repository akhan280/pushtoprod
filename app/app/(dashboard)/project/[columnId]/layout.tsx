import React from "react";
import Sidebar from "@/components/projects/sidebar";
import { PlateEditor } from "@/components/projects/plate";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ProjectLayout({
  ideas,
  development,
  toLaunch,
  params,
}: {
  ideas: React.ReactNode;
  development: React.ReactNode;
  toLaunch: React.ReactNode;
  params: { columnId: string };
}) {
  const { columnId } = params;

  if (!columnId) {
    throw new Error("No column found");
  }

  console.log("Rendering the ProjectLayout");

  const renderContent = () => {
    switch (columnId) {
      
      case "ideas":
        return (
          <>
            {ideas}
            <PlateEditor />
          </>
        );
      case "development":
        return (
          <>
            {development}
          </>
        );
      case "toLaunch":
        return toLaunch
      default:
        console.log("failed")
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        {renderContent()}
      </div>
      {/* Conditionally render the sidebar only for "ideas" and "development" */}
      {(columnId === "ideas" || columnId === "development") && (
        <div className="w-100">
          <Sidebar />
        </div>
      )}
    </div>
  );
}