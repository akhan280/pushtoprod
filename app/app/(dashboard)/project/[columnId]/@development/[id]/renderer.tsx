
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

export default function DevelopmentRender() {
  const {
    selectedProject,
  } = useMainStore();
  const router = useRouter();
  const currentPath = usePathname();
  const [activeTab, setActiveTab] = useState("editor");

  // const [deserializedExcalidrawInitialValue, setDeserializedExcalidrawInitialValue] = useState<Value>(excalidrawInitialValue);

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


        <Tabs defaultValue="technologies"  value={activeTab} onValueChange={handleTabChange} className="w-full">


        <Header partial={false}>
        <TabsList>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="editor">Main Editor</TabsTrigger>
            <TabsTrigger value="excalidraw">Excalidraw</TabsTrigger>
            <TabsTrigger value="databases">Databases</TabsTrigger>
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
            <ExcalidrawCanvas/>
          </TabsContent>

          <TabsContent value="databases">
            <DatabaseVisualizers/>
          </TabsContent>

        </Tabs>
      </TooltipProvider>
    </>
  );
}
