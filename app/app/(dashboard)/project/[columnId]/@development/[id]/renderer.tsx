import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useMainStore from "../../../../../../../lib/hooks/use-main-store";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../../../../components/ui/tabs";
import { PlateEditor } from "../../../../../../../components/projects/plate";
import { TechnologiesContext, TechnologySearch } from "../../../../../../../components/projects/technologies";
import { TooltipProvider } from "../../../../../../../components/ui/plate-ui/tooltip";
import { ExcalidrawCanvas } from "../../../../../../../components/projects/excalidraw/excalidraw";
import { DatabaseVisualizers } from "@/components/projects/database-editors/database-visualizers";
import Header from "../../../../../../../components/projects/header";
import Image from "next/image";

export default function DevelopmentRender() {
  const { selectedProject } = useMainStore();
  const router = useRouter();
  const currentPath = usePathname();
  const [activeTab, setActiveTab] = useState("technologies");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!selectedProject) {
    return null;
  }

  return (
    <>
      <TooltipProvider
        disableHoverableContent
        delayDuration={500}
        skipDelayDuration={0}
      >
        <Tabs defaultValue="technologies" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <Header partial={false}>
            <TabsList className="bg-gray-100 p-2 rounded-full">
              <TabsTrigger
                value="technologies"
                className={`flex items-center rounded-full px-4 py-2 ${activeTab === 'technologies' ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >
                <Image
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/technology-logo.png?t=2024-08-24T03%3A29%3A53.293Z"
                  alt="Technologies Icon"
                  width={15}
                  height={15}
                  className="mr-2"
                />
                Technologies
              </TabsTrigger>

              <TabsTrigger
                value="editor"
                className={`flex items-center rounded-full px-4 py-2 ${activeTab === 'editor' ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >

                <Image
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/editor-logo.png?t=2024-08-24T03%3A35%3A26.565Z"
                  alt="Databases Icon"
                  width={15}
                  height={15}
                  className="mr-2"
                />
                Main Editor
              </TabsTrigger>

              <TabsTrigger
                value="excalidraw"
                className={`flex items-center rounded-full px-4 py-2 ${activeTab === 'excalidraw' ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >
                <Image
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/excalidraw-logo.png?t=2024-08-24T03%3A25%3A49.788Z"
                  alt="Excalidraw Icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Excalidraw
              </TabsTrigger>

              <TabsTrigger
                value="databases"
                className={`flex items-center rounded-full px-4 py-2 ${activeTab === 'databases' ? 'bg-black text-white' : 'bg-transparent text-black'}`}
              >
                <Image
                  src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/site-images/prisma-logo.png"
                  alt="Databases Icon"
                  width={15}
                  height={15}
                  className="mr-2"
                />
                Databases
              </TabsTrigger>
            </TabsList>
          </Header>

          <TabsContent value="technologies">
            <TechnologiesContext variant="icon" technologies={selectedProject.technologies}></TechnologiesContext>
            <TechnologySearch />
          </TabsContent>

          <TabsContent value="editor">
            <PlateEditor></PlateEditor>
          </TabsContent>

          <TabsContent value="excalidraw">
            <ExcalidrawCanvas />
          </TabsContent>

          <TabsContent value="databases">
            <DatabaseVisualizers />
          </TabsContent>

        </Tabs>
      </TooltipProvider>
    </>
  );
}