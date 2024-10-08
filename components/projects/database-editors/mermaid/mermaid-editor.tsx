"use client"
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';
import { updateMermaidSchema } from '../../../../lib/actions';
import useMainStore from '../../../../lib/hooks/use-main-store';

const MermaidEditor: React.FC = () => {

  const mermaidRef = useRef<HTMLDivElement>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);


  const addDebugLog = (message: string) => {
    setDebugLog(prevLogs => [...prevLogs, `[${new Date().toISOString()}] ${message}`]);
  };

  const {selectedProject, setSelectedProject, mermaidSchema, setMermaidSchema} = useMainStore();

  useEffect(() => {
    addDebugLog('Component mounted');
    mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
    addDebugLog('Mermaid initialized');
  }, []);

  useEffect(() => {
    addDebugLog('Schema changed: ' + mermaidSchema);
    if (mermaidRef.current) {
      renderMermaidDiagram();
    } else {
      addDebugLog('mermaidRef is not available');
    }
  }, [mermaidSchema]);

  const renderMermaidDiagram = () => {
    addDebugLog('Attempting to render Mermaid diagram');
    try {
      mermaid.render('mermaid-diagram', mermaidSchema).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          addDebugLog('Mermaid diagram rendered successfully');
        } else {
          addDebugLog('mermaidRef is still not available after rendering');
        }
      }).catch(error => {
        addDebugLog('Error rendering Mermaid diagram: ' + error.message);
      });
    } catch (error) {
      addDebugLog('Exception in renderMermaidDiagram: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <div className="w-1/2 h-full">
          <Editor
            height="100%"
            defaultLanguage="mermaid"
            value={selectedProject.mermaidSchema || ''}
            onChange={ async (value) =>  {
              setMermaidSchema(value || '')
              const data = await updateMermaidSchema(selectedProject.id, value || '');
              setSelectedProject({...data.project!, previous: selectedProject.previous, next: selectedProject.next})

            }}
          />
        </div>
        <div className="w-1/2 h-full overflow-auto bg-gray-100 p-4">
          <div ref={mermaidRef}></div>
        </div>
      </div>
    </div>
  );
};

export default MermaidEditor;