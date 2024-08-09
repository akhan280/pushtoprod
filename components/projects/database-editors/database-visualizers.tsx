import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PrismaEditor from "./prisma/prisma-editor";
import MermaidEditor from "./mermaid/mermaid-editor";
import { useState } from "react";

export const DatabaseVisualizers = () => {
  const [activeTab, setActiveTab] = useState("prisma");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="prisma" value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="prisma">Prisma</TabsTrigger>
        <TabsTrigger value="mermaid">Mermaid</TabsTrigger>
      </TabsList>

      <TabsContent value="prisma">
        <PrismaEditor />
      </TabsContent>

      <TabsContent value="mermaid">
        <MermaidEditor />
      </TabsContent>
    </Tabs>
  );
};