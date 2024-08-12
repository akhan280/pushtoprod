
"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GithubProperty from "./properties/github-property";
import WebsiteProperty from "./properties/website-property";
import TagProperty from "./properties/tag-property";
import CollaboratorProperty from "./properties/collaborator-property";
import { TechnologiesContext } from "./technologies";
import useMainStore from "@/lib/hooks/use-main-store";
import Image from "next/image";

export default function Sidebar() {
  const { selectedProject } = useMainStore();

  return (
    <div className="p-4 mt-10">
      <Card className="p-4">
        <Card className="mb-6">
          <CardHeader className="text-lg font-semibold">Properties</CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center space-x-4">
              Collaborators
              <CollaboratorProperty />
            </div>

            <div className="flex justify-between items-center">
              Tags
              <TagProperty />
            </div>
            <div className="flex justify-between items-center">
              Github
              <GithubProperty />
            </div>
            <div className="flex justify-between items-center">
              Wesbite
              <WebsiteProperty />
            </div>


            <div className="flex justify-between items-center">
              Technologies
              {/* <TechnologiesContext variant="icon" technologies={selectedProject?.technologies}></TechnologiesContext> */}
            </div>
            <div className="flex justify-between items-center">
              <span>Dates</span>
              <div className="flex space-x-2">
                <span>Start</span>
                <span className="text-gray-400">→</span>
                <span>Target</span>
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="space-y-4 mt-20">

          <Image
            height={30}
            width={410}
            loading="eager"
            src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/ideas.png"
            alt="ideas"
            className="rounded-3xl transition-all duration-300 hover:opacity-90 hover:ring-1 hover:ring-black/30 hover:ring-offset-1"

          />

          <Image
            height={30}
            width={410}
            loading="eager"
            src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/development.png"
            alt="ideas"
            className="rounded-3xl transition-all duration-300 hover:opacity-90 hover:ring-1 hover:ring-black/30 hover:ring-offset-1"

          />


          <Image
            height={30}
            width={410}
            loading="eager"
            src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/launch.png"
            alt="ideas"
            className="rounded-3xl transition-all duration-300 hover:opacity-90 hover:ring-1 hover:ring-black/30 hover:ring-offset-1"

          />

        </div>
      </Card>
    </div>
  );
}
