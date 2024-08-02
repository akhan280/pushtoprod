"use server"
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import ColumnRender from "./column-render";


export default async function ProjectLayout({ children, params }: { children: ReactNode, params: { columnId: string }  }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col justify-center items-center place-items-center">
      <ColumnRender></ColumnRender>
      {children}
    </div>
    );
}