"use client";
import {
  plugins,
  editorInitialValue as defaultInitialValue,
  excalidrawInitialValue,
} from "@/plateconfig";
import useMainStore from "../../lib/hooks/use-main-store";
import { DndProvider } from "react-dnd/dist/core/DndProvider";

import { CommentsProvider } from "@udecode/plate-comments";

import {
  Plate,
  PlateController,
  PlateStoreState,
  Value,
} from "@udecode/plate-common";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

import { HTML5Backend } from "react-dnd-html5-backend";
import { usePathname, useRouter } from "next/navigation";

import { CommentsPopover } from "../ui/plate-ui/comments-popover";
import { FloatingToolbar } from "../ui/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../ui/plate-ui/floating-toolbar-buttons";
import { Editor } from "../ui/plate-ui/editor";
import { FixedToolbar } from "../ui/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "../ui/plate-ui/fixed-toolbar-buttons";
import { updateEditor } from "../../lib/actions";
import { select } from "slate";


// Combine the editors into a single component with tabs
export function PlateEditor() {
  const {
    selectedProject,
    editor,
    setSelectedProject
  } = useMainStore();

  const handleEditorChange = async (newValue: Value) => {
      const serializedValue = JSON.stringify(newValue);
      console.log('[Editor] Setting data', serializedValue);
      const data = await updateEditor(serializedValue, selectedProject.id);
      setSelectedProject({ ...data.project!, next: selectedProject.next, previous: selectedProject.previous });
  };

  if (!selectedProject) {
    return null;
  }

  const deserializedInitialValue: Value = selectedProject.textEditor
    ? JSON.parse(selectedProject.textEditor)
    : defaultInitialValue;

  return (
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
  );
}
