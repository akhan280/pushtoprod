"use client"
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';

const MermaidEditor: React.FC = () => {
  const [schema, setSchema] = useState<string>(`graph TD
    A[Start] --> B[End]`);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    setDebugLog(prevLogs => [...prevLogs, `[${new Date().toISOString()}] ${message}`]);
  };

  useEffect(() => {
    addDebugLog('Component mounted');
    mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
    addDebugLog('Mermaid initialized');
  }, []);

  useEffect(() => {
    addDebugLog('Schema changed: ' + schema);
    if (mermaidRef.current) {
      renderMermaidDiagram();
    } else {
      addDebugLog('mermaidRef is not available');
    }
  }, [schema]);

  const renderMermaidDiagram = () => {
    addDebugLog('Attempting to render Mermaid diagram');
    try {
      mermaid.render('mermaid-diagram', schema).then(({ svg }) => {
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
            value={schema}
            onChange={(value) => setSchema(value || '')}
          />
        </div>
        <div className="w-1/2 h-full overflow-auto bg-gray-100 p-4">
          <div ref={mermaidRef}></div>
        </div>
      </div>
      <div className="h-1/4 overflow-auto bg-black text-white p-2">
        <h3 className="text-xl mb-2">Debug Log:</h3>
        {debugLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default MermaidEditor;