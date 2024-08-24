import React from "react";
import Sidebar from "@/components/projects/sidebar";
import { PlateEditor } from "@/components/projects/plate";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";

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
            <div className = "mt-20">
            <PlateEditor />


            </div>
            
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
        <div className="w-100 relative overflow-visible">
          <div
            className=" absolute inset-0  z-20 rounded-3xl"
            style={{
              width: 100,
              height: 400,
              backgroundImage: "url('https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/blue-gradient.png?t=2024-08-24T01%3A00%3A21.874Z')",
              backgroundSize: "cover",
              backgroundPosition: "right center",
              overflow: "visible",
            }}
          />
          <div className="relative z-30">
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}