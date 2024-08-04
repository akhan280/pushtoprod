'use client';
import { plugins, editorInitialValue as defaultInitialValue, excalidrawInitialValue} from '@/plateconfig';
import useMainStore from '../../lib/hooks/use-main-store';
import { DndProvider } from 'react-dnd/dist/core/DndProvider';
import { TooltipProvider } from '../plate-ui/tooltip';
import { CommentsProvider } from '@udecode/plate-comments';
import { serializeAsJSON } from "@excalidraw/excalidraw";
import { Plate, PlateStoreState, Value } from '@udecode/plate-common';
import { FixedToolbar } from '../plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '../plate-ui/fixed-toolbar-buttons';
import { Editor } from '../plate-ui/editor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { FloatingToolbar } from '../plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '../plate-ui/floating-toolbar-buttons';
import { CommentsPopover } from '../plate-ui/comments-popover';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Combine the editors into a single component with tabs
export function PlateEditor() {
  const { selectedProject, setEditorProperty, setExcalidrawProperty, editor, excalidraw} = useMainStore();
  const router = useRouter();
  const currentPath = usePathname()
  const [activeTab, setActiveTab] = useState('editor');
  // const [deserializedExcalidrawInitialValue, setDeserializedExcalidrawInitialValue] = useState<Value>(excalidrawInitialValue);


  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleEditorChange = (newValue: Value) => {
    if (selectedProject) {
      const serializedValue = JSON.stringify(newValue);
      console.log('rendering', serializedValue);
      setEditorProperty(serializedValue);
    }
  };

  const handleExcalidrawChange = (newValue: Value) => {
    if (selectedProject) {
      const serializedValue = JSON.stringify(newValue);
      console.log('rendering', serializedValue);
      setExcalidrawProperty(serializedValue);
    }
  };

  if (!selectedProject) {
    return null; // or return a loading indicator if preferred
  }

  const deserializedInitialValue: Value = selectedProject.textEditor
    ? JSON.parse(selectedProject.textEditor)
    : defaultInitialValue;

    // console.log("des",deserializedExcalidrawInitialValue)

    // useEffect(() => {
    //   if (selectedProject.excalidrawEditor) {
    //     const newExcalidrawValue = JSON.parse(selectedProject.excalidrawEditor);
    //     setDeserializedExcalidrawInitialValue(newExcalidrawValue);
    //     console.log("des", newExcalidrawValue);
    //   }
    // }, [selectedProject.excalidrawEditor]);

    const deserializedExcalidrawInitialValue: Value = selectedProject.excalidrawEditor
    ? JSON.parse(selectedProject.excalidrawEditor)
    : excalidrawInitialValue;

  

    // useEffect(() => {
    // }, [activeTab, editor, excalidraw]);


  return (
    <DndProvider backend={HTML5Backend}>
      <CommentsProvider users={{}} myUserId="1">
        <TooltipProvider
          disableHoverableContent
          delayDuration={500}
          skipDelayDuration={0}
        >
          <Tabs defaultValue="editor" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList>
              <TabsTrigger value="editor">Main Editor</TabsTrigger>
              <TabsTrigger value="excalidraw">Excalidraw</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <Plate onChange={handleEditorChange} plugins={plugins} initialValue={deserializedInitialValue}>
                <FixedToolbar>
                  <FixedToolbarButtons />
                </FixedToolbar>
                <Editor />
                <FloatingToolbar>
                  <FloatingToolbarButtons />
                </FloatingToolbar>
                <CommentsPopover />
              </Plate>
            </TabsContent>
            <TabsContent value="excalidraw">
              <Plate onChange={handleExcalidrawChange} plugins={plugins} initialValue={deserializedExcalidrawInitialValue}>
                <Editor />
              </Plate>
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </CommentsProvider>
    </DndProvider>
  );
}

