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

  const determineRelationshipLabel = (fromModel: string, toModel: string, fromCardinality: string, toCardinality: string): string => {
    if (fromCardinality === "*" && toCardinality === "1") {
      return `${fromModel} has many ${toModel}`;
    } else if (fromCardinality === "1" && toCardinality === "1") {
      return `${fromModel} has a ${toModel}`;
    } else if (fromCardinality === "1" && toCardinality === "*") {
      return `${fromModel} belongs to ${toModel}`;
    } else if (fromCardinality === "*" && toCardinality === "*") {
      return `${fromModel} relates to ${toModel}`;
    }
    return `${fromModel} has a ${toModel}`;
  };

  const parsePrismaSchema = (schema: string): string => {
    addDebugLog('Parsing Prisma schema');
    let mermaidCode = "classDiagram\n\ndirection TB\n\n"; // Top-bottom layout
    
    const modelRegex = /model\s+(\w+)\s*{([^}]*)}/gs;
    const fieldRegex = /(\w+)\s+([\w\[\]?]+)(\s*@[^(\n]*(\([^)]*\))?)?/g;
    const relationRegex = /@relation\s*\(([^)]+)\)/;
  
    const models: Record<string, any[]> = {};
    const relations: Array<{from: string; to: string; fromField: string; toField: string; relationType: string}> = [];
  
    let modelMatch;
    while ((modelMatch = modelRegex.exec(schema)) !== null) {
      const modelName = modelMatch[1];
      const modelBody = modelMatch[2];
      models[modelName] = [];
      addDebugLog(`Found model: ${modelName}`);
  
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
        const [, fieldName, fieldType, attributes] = fieldMatch;
        const isPrimaryKey = attributes?.includes('@id') || false;
        const isUnique = attributes?.includes('@unique') || false;
        const isForeignKey = attributes?.includes('@relation') || false;
        models[modelName].push({ fieldName, fieldType, isPrimaryKey, isUnique, isForeignKey });
        addDebugLog(`Found field: ${fieldName} of type ${fieldType} in model ${modelName}`);
  
        if (attributes) {
          const relationMatch = relationRegex.exec(attributes);
          if (relationMatch) {
            const relationInfo = relationMatch[1];
            const fieldsMatch = /fields:\s*\[(\w+)\]/.exec(relationInfo);
            const referencesMatch = /references:\s*\[(\w+)\]/.exec(relationInfo);
            if (fieldsMatch && referencesMatch) {
              const fromField = fieldsMatch[1];
              const toField = referencesMatch[1];
              const targetModel = fieldType.replace('?', '').replace('[]', '');
              
              const fromCardinality = fieldType.includes('[]') ? "*" : "1";
              const toCardinality = "1";
              const relationLabel = determineRelationshipLabel(modelName, targetModel, fromCardinality, toCardinality);

              relations.push({ 
                from: targetModel, // Invert relationship direction
                to: modelName, 
                fromField: toField, // Invert relationship fields
                toField: fromField, 
                relationType: relationLabel
              });
              addDebugLog(`Found inverted relation from ${targetModel}.${toField} to ${modelName}.${fromField}`);
            }
          }
        }
      }
    }
  
    // Generate Mermaid code for models and fields
    for (const [modelName, fields] of Object.entries(models)) {
      mermaidCode += `class ${modelName} {\n`;
      fields.forEach(field => {
        let fieldString = `    ${field.fieldType} ${field.fieldName}`;
        if (field.isPrimaryKey) fieldString += ' PK';
        if (field.isUnique) fieldString += ' UK';
        if (field.isForeignKey) fieldString += ' FK';
        mermaidCode += fieldString + '\n';
      });
      mermaidCode += '}\n\n';
    }
  
    // Generate Mermaid code for relationships
    relations.forEach(relation => {
      mermaidCode += `${relation.from} --> ${relation.to} : ${relation.relationType}\n`;
    });
  
    addDebugLog('Generated Mermaid code:\n' + mermaidCode);
  
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
