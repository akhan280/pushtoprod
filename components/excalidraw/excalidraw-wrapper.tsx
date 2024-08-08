import React, { useState, useCallback, useEffect } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState } from '@excalidraw/excalidraw/types/types';
import { updateExcalidrawData } from '../../lib/actions';

interface ExcalidrawWrapperProps {
  projectId: string;
  initialData: string;
}

const ExcalidrawWrapper: React.FC<ExcalidrawWrapperProps> = ({ projectId, initialData }) => {
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
    const debounce = setTimeout(() => {
      updateExcalidrawData(projectId, excalidrawData);
    }, 300);

    return () => clearTimeout(debounce);
  }, [excalidrawData, projectId]);

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