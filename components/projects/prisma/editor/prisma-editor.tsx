// "use client"
// import React, { useState, useEffect, useRef } from 'react';
// import Editor from '@monaco-editor/react';
// import mermaid from 'mermaid';

// const PrismaEditor: React.FC = () => {
//   const [schema, setSchema] = useState<string>(`graph TD
//     A[Start] --> B[End]`);
//   const mermaidRef = useRef<HTMLDivElement>(null);
//   const [debugLog, setDebugLog] = useState<string[]>([]);

//   const addDebugLog = (message: string) => {
//     setDebugLog(prevLogs => [...prevLogs, `[${new Date().toISOString()}] ${message}`]);
//   };

//   useEffect(() => {
//     addDebugLog('Component mounted');
//     mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
//     addDebugLog('Mermaid initialized');
//   }, []);

//   useEffect(() => {
//     addDebugLog('Schema changed: ' + schema);
//     if (mermaidRef.current) {
//       renderMermaidDiagram();
//     } else {
//       addDebugLog('mermaidRef is not available');
//     }
//   }, [schema]);

//   const renderMermaidDiagram = () => {
//     addDebugLog('Attempting to render Mermaid diagram');
//     try {
//       mermaid.render('mermaid-diagram', schema).then(({ svg }) => {
//         if (mermaidRef.current) {
//           mermaidRef.current.innerHTML = svg;
//           addDebugLog('Mermaid diagram rendered successfully');
//         } else {
//           addDebugLog('mermaidRef is still not available after rendering');
//         }
//       }).catch(error => {
//         addDebugLog('Error rendering Mermaid diagram: ' + error.message);
//       });
//     } catch (error) {
//       addDebugLog('Exception in renderMermaidDiagram: ' + (error as Error).message);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <div className="flex flex-1">
//         <div className="w-1/2 h-full">
//           <Editor
//             height="100%"
//             defaultLanguage="mermaid"
//             value={schema}
//             onChange={(value) => setSchema(value || '')}
//           />
//         </div>
//         <div className="w-1/2 h-full overflow-auto bg-gray-100 p-4">
//           <div ref={mermaidRef}></div>
//         </div>
//       </div>
//       <div className="h-1/4 overflow-auto bg-black text-white p-2">
//         <h3 className="text-xl mb-2">Debug Log:</h3>
//         {debugLog.map((log, index) => (
//           <p key={index}>{log}</p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PrismaEditor;
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import mermaid from 'mermaid';

const PrismaEditor: React.FC = () => {
  const [schema, setSchema] = useState<string>('');
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    setDebugLog(prevLogs => [...prevLogs, `[${new Date().toISOString()}] ${message}`]);
  };

  const parsePrismaSchema = (schema: string): string => {
    addDebugLog('Parsing Prisma schema');
    let mermaidCode = "classDiagram\n";
    
    const modelRegex = /model (\w+) \{([^}]+)\}/g;
    const relationRegex = /@relation\(([^)]+)\)/g;
    let match;

    const models = {};
    const relations = [];

    while ((match = modelRegex.exec(schema)) !== null) {
      const modelName = match[1];
      const modelBody = match[2];
      models[modelName] = [];

      const fieldRegex = /(\w+)\s+([\w\[\]]+)([^@]*)/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
        const fieldName = fieldMatch[1];
        const fieldType = fieldMatch[2];
        const fieldAttributes = fieldMatch[3].trim();

        models[modelName].push({ fieldName, fieldType, fieldAttributes });

        const relationMatch = relationRegex.exec(fieldAttributes);
        if (relationMatch) {
          const relationParts = relationMatch[1].split(',');
          const referencesPart = relationParts.find(part => part.includes('references'));
          const fieldsPart = relationParts.find(part => part.includes('fields'));
          if (referencesPart && fieldsPart) {
            const relatedModel = referencesPart.split(':')[1].trim();
            const foreignKey = fieldsPart.split(':')[1].trim();
            relations.push({ from: modelName, to: relatedModel, field: fieldName, foreignKey });
          }
        }
      }
    }

    // Generate Mermaid code for models and fields
    for (const [modelName, fields] of Object.entries(models)) {
      mermaidCode += `class ${modelName} {\n`;
      fields.forEach(field => {
        mermaidCode += `  ${field.fieldName}: ${field.fieldType}\n`;
      });
      mermaidCode += '}\n';
    }

    // Generate Mermaid code for relationships
    relations.forEach(relation => {
      mermaidCode += `${relation.from} --> ${relation.to} : ${relation.field}\n`;
    });

    // Ensure that the generated Mermaid code does not contain any syntax errors
    try {
      mermaid.parse(mermaidCode);
    } catch (err) {
      addDebugLog('Mermaid syntax error: ' + err.str);
      throw new Error('Invalid Mermaid syntax generated from Prisma schema.');
    }

    addDebugLog('Prisma schema parsed successfully');
    return mermaidCode;
  };

  const renderMermaidDiagram = () => {
    addDebugLog('Attempting to render Mermaid diagram');
    try {
      const mermaidCode = parsePrismaSchema(schema);
      mermaid.render('mermaid-diagram', mermaidCode).then(({ svg }) => {
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

  useEffect(() => {
    addDebugLog('Component mounted');
    mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
    addDebugLog('Mermaid initialized');
  }, []);

  useEffect(() => {
    if (schema.trim()) {
      addDebugLog('Schema changed: ' + schema);
      if (mermaidRef.current) {
        renderMermaidDiagram();
      } else {
        addDebugLog('mermaidRef is not available');
      }
    }
  }, [schema]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 h-full">
          <Editor
            height="100%"
            defaultLanguage="prisma"
            value={schema}
            onChange={(value) => setSchema(value || '')}
            options={{
              theme: 'vs-dark',
              minimap: { enabled: false },
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
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

export default PrismaEditor;

