'use client';
import { plugins, initialValue as defaultInitialValue } from '@/plateconfig';
import useMainStore from '../../lib/hooks/use-main-store';
import { DndProvider } from 'react-dnd/dist/core/DndProvider';
import { TooltipProvider } from '../plate-ui/tooltip';
import { CommentsProvider } from '@udecode/plate-comments';
import { Plate, PlateStoreState, Value } from '@udecode/plate-common';
import { FixedToolbar } from '../plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '../plate-ui/fixed-toolbar-buttons';
import { Editor } from '../plate-ui/editor';
import { FloatingToolbar } from '../plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '../plate-ui/floating-toolbar-buttons';
import { CommentsPopover } from '../plate-ui/comments-popover';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function PlateEditor() {
  const { selectedProject, setEditorProperty } = useMainStore();

  const handleChange = (newValue: Value) => {
    if (selectedProject) {
      const serializedValue = JSON.stringify(newValue);
      console.log('rendering', serializedValue);
      setEditorProperty(serializedValue);
    }
  };

  if (!selectedProject) {
    return null; // or return a loading indicator if preferred
  }

  const deserializedInitialValue: Value = selectedProject.textEditor
    ? JSON.parse(selectedProject.textEditor)
    : defaultInitialValue;

    console.log('deserialized number', deserializedInitialValue)
  return (
    <DndProvider backend={HTML5Backend}>
      <CommentsProvider users={{}} myUserId="1">
        <TooltipProvider
          disableHoverableContent
          delayDuration={500}
          skipDelayDuration={0}
        >
          <Plate onChange={handleChange} plugins={plugins} initialValue={deserializedInitialValue}>
            <FixedToolbar>
              <FixedToolbarButtons />
            </FixedToolbar>
            <Editor />
            <FloatingToolbar>
              <FloatingToolbarButtons />
            </FloatingToolbar>
            <CommentsPopover />
          </Plate>
        </TooltipProvider>
      </CommentsProvider>
    </DndProvider>
  );
}
