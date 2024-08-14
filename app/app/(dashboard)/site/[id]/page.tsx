import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { LocalSiteData, Section } from "../types";
import { SiteRender } from "./siteContent";
import { testLocalSiteData } from "./testData";

export default async function SitePosts({
  params,
}: {
  params: { id: string };
}) {
  // const session = await getSession();
  // if (!session) {
  //   redirect("/login");
  // }
  const data = await prisma.site.findUnique({
    where: {
      id: decodeURIComponent(params.id),
    },
  });

  // if (!data || data.userId !== session.id) {
  //   notFound();
  // }

  const siteJson = JSON.parse(data!.sections as string);
  const siteData: LocalSiteData = {
    ...data!, 
    parsedSections: siteJson as Section[]
  };

  // THIS IS OUR TEST CASE
  // const siteData = testLocalSiteData;

  // const url = `${data.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  return <SiteRender initialSiteData={siteData} url={'url'} />;
}
