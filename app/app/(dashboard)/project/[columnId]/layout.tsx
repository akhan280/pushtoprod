"use server"
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import ColumnRender from "./column-render";


export default async function ProjectLayout({ children, params }: { children: ReactNode, params: { columnId: string }  }) {

  const { columnId } = params; // Extract columnId from params
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col justify-center items-center place-items-center">
      <ColumnRender columnId={columnId} />
      {children}
    </div>
    );
}