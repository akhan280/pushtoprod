import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";
import Header from "../../../../../components/dialog/header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../../../components/ui/breadcrumb";
import React from "react";

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
  const dummyPost = {
    id: "post1",
    title: "Dummy Post",
    description: "This is a dummy post",
    content: "Lorem ipsum dolor sit amet",
    slug: "dummy-post",
    image: "https://example.com/image.png",
    imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true,
    siteId: "site1",
    userId: "user1",
    site: {
      id: "site1",
      name: "Dummy Site",
      description: "This is a dummy site",
      logo: "https://example.com/logo.png",
      font: "Arial",
      image: "https://example.com/site-image.png",
      imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
      subdomain: "dummy-site",
      customDomain: "dummy-site.com",
      message404: "Page not found",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
    },
  };

  return (<div className="flex flex-col justify-center items-center place-items-center"> 
    <Breadcrumb>
    <BreadcrumbList>
        <BreadcrumbItem>
        <BreadcrumbLink href="/settings">areebkhan</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        <BreadcrumbLink href="/">projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        <BreadcrumbPage>{data.title}</BreadcrumbPage>
        </BreadcrumbItem>
    </BreadcrumbList>
    </Breadcrumb>

    <Header></Header>
    hello world {data.columnId}, {data.columnId}, {data.description}, {data.githuburl}, {data.notes}, {data.technologies}, {data.title}
    <Editor post={dummyPost} />
    </div>)}
