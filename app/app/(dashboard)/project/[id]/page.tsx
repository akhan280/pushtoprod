import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";

export default async function ProjectPage({ params }: { params: { id: string } }) {


    
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  console.log(params.id)
  const data = await prisma.project.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });
  if (!data) {
    notFound();
  }

  return (<div> hello world {data.columnId}, {data.columnId}, {data.description}, {data.githuburl}, {data.notes}, {data.technologies}, {data.title}</div>)}
