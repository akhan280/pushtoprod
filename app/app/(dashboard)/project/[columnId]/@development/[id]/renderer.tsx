import { createProject } from "../../../../../../../lib/actions";

import {
  plugins,
  editorInitialValue as defaultInitialValue,
  excalidrawInitialValue,
} from "@/plateconfig";

import { DndProvider } from "react-dnd/dist/core/DndProvider";
import { CommentsProvider } from "@udecode/plate-comments";
import { Plate, PlateStoreState, Value } from "@udecode/plate-common";
import { HTML5Backend } from "react-dnd-html5-backend";
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
import { CommentsPopover } from "../../../../../../../components/ui/plate-ui/comments-popover";
import { FloatingToolbar } from "../../../../../../../components/ui/plate-ui/floating-toolbar";
import { FixedToolbar } from "../../../../../../../components/ui/plate-ui/fixed-toolbar";
import { FloatingToolbarButtons } from "../../../../../../../components/ui/plate-ui/floating-toolbar-buttons";
import { TechnologiesContext, TechnologySearch } from "../../../../../../../components/projects/technologies";
import { FixedToolbarButtons } from "../../../../../../../components/ui/plate-ui/fixed-toolbar-buttons";
import { Editor } from "../../../../../../../components/ui/plate-ui/editor";
import { TooltipProvider } from "../../../../../../../components/ui/plate-ui/tooltip";

// Combine the editors into a single component with tabs
export default function DevelopmentRender() {
  const {
    selectedProject,
    setEditorProperty,
    setExcalidrawProperty,
    editor,
    excalidraw,
  } = useMainStore();
  const router = useRouter();
  const currentPath = usePathname();
  const [activeTab, setActiveTab] = useState("editor");

  // const [deserializedExcalidrawInitialValue, setDeserializedExcalidrawInitialValue] = useState<Value>(excalidrawInitialValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleExcalidrawChange = (newValue: Value) => {
    if (selectedProject) {
      const serializedValue = JSON.stringify(newValue);
      console.log("rendering", serializedValue);
      setExcalidrawProperty(serializedValue);
    }
  };

  if (!selectedProject) {
    return null;
  }

  const deserializedInitialValue: Value = selectedProject.textEditor
    ? JSON.parse(selectedProject.textEditor)
    : defaultInitialValue;

    

  const deserializedExcalidrawInitialValue: Value =
    selectedProject.excalidrawEditor
      ? JSON.parse(selectedProject.excalidrawEditor)
      : excalidrawInitialValue;

      const handleEditorChange = (newValue: Value) => {
        if (selectedProject) {
          const serializedValue = JSON.stringify(newValue);
          console.log("rendering", serializedValue);
          setEditorProperty(serializedValue);
        }
      };

  return (
    <>
      <TooltipProvider
        disableHoverableContent
        delayDuration={500}
        skipDelayDuration={0}
      >
        <Tabs defaultValue="technologies"  value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList>
             <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="editor">Main Editor</TabsTrigger>
            <TabsTrigger value="excalidraw">Excalidraw</TabsTrigger>
          </TabsList>

          <TabsContent value="technologies">
            <TechnologiesContext variant="iconWithText" technologies={selectedProject.technologies}></TechnologiesContext>
            <TechnologySearch />
          </TabsContent>

          <TabsContent value="editor">
          <DndProvider backend={HTML5Backend}>
      <CommentsProvider users={{}} myUserId="1">
        <Plate
          onChange={handleEditorChange}
          plugins={plugins}
          initialValue={deserializedInitialValue}
        >
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>
          <Editor />
          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>
          <CommentsPopover />
        </Plate>
      </CommentsProvider>
    </DndProvider>
          </TabsContent>

          <TabsContent value="excalidraw">
            
            <Plate
              onChange={handleExcalidrawChange}
              plugins={plugins}
              initialValue={deserializedExcalidrawInitialValue}
            >
              <Editor />
            </Plate>

          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </>
  );
}
