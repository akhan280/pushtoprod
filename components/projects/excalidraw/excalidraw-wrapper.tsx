import React, { useState, useCallback, useEffect } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState } from '@excalidraw/excalidraw/types/types';
import { updateExcalidrawData } from '../../../lib/actions';
import useMainStore from '../../../lib/hooks/use-main-store';
import { previous } from 'slate';

interface ExcalidrawWrapperProps {
  projectId: string;
  initialData: string;
}

const ExcalidrawWrapper: React.FC<ExcalidrawWrapperProps> = ({ projectId, initialData }) => {

  const {selectedProject, setSelectedProject} = useMainStore();

  const [excalidrawData, setExcalidrawData] = useState(() => {
    try {
      const parsedData = JSON.parse(initialData);
      return {
        elements: parsedData.elements || [],
        appState: {
          viewBackgroundColor: parsedData.appState?.viewBackgroundColor || "#AFEEEE",
          currentItemFontFamily: parsedData.appState?.currentItemFontFamily || 1,
        },
      };
    } catch {
      return {
        elements: [],
        appState: { viewBackgroundColor: "#AFEEEE", currentItemFontFamily: 1 },
      };
    }
  });

  const onChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState) => {
    const minimalAppState = {
      viewBackgroundColor: appState.viewBackgroundColor,
      currentItemFontFamily: appState.currentItemFontFamily,
    };
    
    setExcalidrawData({ elements, appState: minimalAppState });
  }, []);
  useEffect(() => {
    const debounce = setTimeout(async () => {
      console.log('[Excalidraw] Setting data', excalidrawData);
      const data = await updateExcalidrawData(projectId, excalidrawData);
      setSelectedProject({ ...data.project!, next: selectedProject.next, previous: selectedProject.previous });
    }, 300);

    return () => clearTimeout(debounce);
  }, [excalidrawData]);

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Excalidraw
        initialData={excalidrawData}
        onChange={onChange}
      />
    </div>
  );
};

export default ExcalidrawWrapper;