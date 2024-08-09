// import Editor, { useMonaco } from "@monaco-editor/react";
// import { type editor } from "monaco-editor";
// import { useTheme } from "next-themes";
// import { useEffect, useMemo, useState } from "react";
// import * as prismaLanguage from "./editor-utils/prisma-lang";

// const PrismaEditor = () => {
//   const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
//     null
//   );

//   const monaco = useMonaco();

//   // Find the model for the 'prisma' language in the editor
//   const model = monaco?.editor
//     .getModels()
//     .find((m) => m.getLanguageId() === "prisma");

//   useEffect(() => {
//     if (monaco) {
//       // Register the Prisma language and set its configuration and token provider
//       monaco.languages.register({ id: "prisma" });
//       monaco.languages.setLanguageConfiguration(
//         "prisma",
//         prismaLanguage.config
//       );
//       monaco.languages.setMonarchTokensProvider(
//         "prisma",
//         prismaLanguage.language
//       );
//     }
//   }, [monaco]);

//   const { resolvedTheme } = useTheme();

//   return (
//     <div className="h-full">
//       <Editor
//         key="prisma"
//         language="prisma"
//         theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
//         loading="Loading..."
//         height="3000px"
//         path="prisma"
//         options={{
//           minimap: { enabled: false },
//           smoothScrolling: true,
//           cursorSmoothCaretAnimation: "on",
//           scrollBeyondLastLine: true,
//         }}
//         onMount={(editor) => setEditor(editor)}
//       />
//     </div>
//   );
// };

// export default PrismaEditor;
// import React, { useState, useEffect } from 'react';
// import Editor from '@monaco-editor/react';
// import ReactFlow, { Background, useNodesState, useEdgesState, Node, Edge } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { nanoid } from 'nanoid';

// // Define node types and edge types outside of the component
// const nodeTypes = {}; // add your custom nodes here if any
// const edgeTypes = {}; // add your custom edges here if any

// // Type definitions for models and relations
// interface Model {
//   name: string;
//   fields: string[];
// }

// interface Relation {
//   source: string;
//   target: string;
// }

// const PrismaEditor: React.FC = () => {
//   const [schema, setSchema] = useState<string>('');
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

//   useEffect(() => {
//     const parsedNodes = parseSchemaToNodes(schema);
//     const parsedEdges = parseSchemaToEdges(schema);
//     setNodes(parsedNodes);
//     setEdges(parsedEdges);
//   }, [schema]);

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <Editor
//         height="3000px"
//         defaultLanguage="prisma"
//         value={schema}
//         onChange={(value) => setSchema(value || '')}
//       />
//       <div className="reactflow-wrapper" style={{ height: '50%' }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           nodeTypes={nodeTypes} // provide the nodeTypes to ReactFlow
//           edgeTypes={edgeTypes} // provide the edgeTypes to ReactFlow
//           fitView
//           style={{ width: '100%', height: '100%' }}
//         >
//           <Background color="grey" />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// };

// export default PrismaEditor;

// function parseSchemaToNodes(schema: string): Node[] {
//   const models = extractModels(schema);
//   return models.map((model) => ({
//     id: model.name,
//     data: { label: model.name },
//     position: { x: Math.random() * 400, y: Math.random() * 400 },
//     type: 'default',
//   }));
// }

// function parseSchemaToEdges(schema: string): Edge[] {
//   const relations = extractRelations(schema);
//   return relations.map((relation) => ({
//     id: nanoid(),
//     source: relation.source,
//     target: relation.target,
//     type: 'smoothstep',
//   }));
// }

// function extractModels(schema: string): Model[] {
//   // Regex to match model blocks in the schema
//   const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;
//   const models: Model[] = [];
//   let match: RegExpExecArray | null;

//   while ((match = modelRegex.exec(schema)) !== null) {
//     models.push({
//       name: match[1],
//       fields: extractFields(match[2]),
//     });
//   }

//   return models;
// }

// function extractRelations(schema: string): Relation[] {
//   // Regex to match relations in the schema
//   const relationRegex = /@relation\((.*?)\)/g;
//   const relations: Relation[] = [];
//   let match: RegExpExecArray | null;

//   while ((match = relationRegex.exec(schema)) !== null) {
//     const [source, target] = match[1].split(',').map((str) => str.trim());
//     if (source && target) {
//       relations.push({
//         source,
//         target,
//       });
//     }
//   }

//   return relations;
// }

// function extractFields(fieldsString: string): string[] {
//   return fieldsString.split('\n').map((field) => field.trim()).filter(Boolean);
// }


// import React, { useState, useEffect, useMemo } from 'react';
// import Editor from '@monaco-editor/react';
// import ReactFlow, { Background, useNodesState, useEdgesState, Node, Edge } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { nanoid } from 'nanoid';
// import mermaid from 'mermaid';
// // import 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';


// // Define node types and edge types outside of the component
// const nodeTypes = useMemo(() => ({}), []);
// const edgeTypes = useMemo(() => ({}), []);

// // Type definitions for models and relations
// interface Model {
//   name: string;
//   fields: string[];
// }

// interface Relation {
//   source: string;
//   target: string;
// }

// const PrismaEditor: React.FC = () => {
//   const [schema, setSchema] = useState<string>('');
//   const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

//   useEffect(() => {
//     const parsedNodes = parseSchemaToNodes(schema);
//     const parsedEdges = parseSchemaToEdges(schema);
//     setNodes(parsedNodes);
//     setEdges(parsedEdges);
//     parseSchemaToDiagram(schema);
//   }, [schema]);

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <Editor
//         height="3000px"
//         defaultLanguage="prisma"
//         value={schema}
//         onChange={(value) => setSchema(value || '')}
//       />
//       <div className="reactflow-wrapper" style={{ height: '50%' }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           nodeTypes={nodeTypes} // provide the nodeTypes to ReactFlow
//           edgeTypes={edgeTypes} // provide the edgeTypes to ReactFlow
//           fitView
//           style={{ width: '100%', height: '100%' }}
//         >
//           <Background color="grey" />
//           <div id="mermaid-diagram" />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// };

// export default PrismaEditor;

// function parseSchemaToNodes(schema: string): Node[] {
//   const models = extractModels(schema);
//   return models.map((model) => ({
//     id: model.name,
//     data: { label: model.name },
//     position: { x: Math.random() * 400, y: Math.random() * 400 },
//     type: 'default',
//   }));
// }

// function parseSchemaToEdges(schema: string): Edge[] {
//   const relations = extractRelations(schema);
//   return relations.map((relation) => ({
//     id: nanoid(),
//     source: relation.source,
//     target: relation.target,
//     type: 'smoothstep',
//   }));
// }

// function parseSchemaToDiagram(schema: string) {
//   const models = extractModels(schema);
//   const relations = extractRelations(schema);

//   let mermaidDiagram = 'erDiagram\n';

//   models.forEach((model) => {
//     mermaidDiagram += `  ${model.name} {
// `;
//     model.fields.forEach((field) => {
//       mermaidDiagram += `    ${field}\n`;
//     });
//     mermaidDiagram += '  }\n';
//   });

//   relations.forEach((relation) => {
//     mermaidDiagram += `  ${relation.source} ||--o{ ${relation.target} : "${relation.source} is related to ${relation.target}"\n`;
//   });

//   mermaid.render('mermaid-diagram', mermaidDiagram, (svg) => {
//     const mermaidDiagramContainer = document.getElementById('mermaid-diagram');
//     if (mermaidDiagramContainer) {
//       mermaidDiagramContainer.innerHTML = svg;
//     }
//   });
// }

// function extractModels(schema: string): Model[] {
//   // Regex to match model blocks in the schema
//   const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;
//   const models: Model[] = [];
//   let match: RegExpExecArray | null;

//   while ((match = modelRegex.exec(schema)) !== null) {
//     models.push({
//       name: match[1],
//       fields: extractFields(match[2]),
//     });
//   }

//   return models;
// }

// function extractRelations(schema: string): Relation[] {
//   // Regex to match relations in the schema
//   const relationRegex = /@relation\((.*?)\)/g;
//   const relations: Relation[] = [];
//   let match: RegExpExecArray | null;

//   while ((match = relationRegex.exec(schema)) !== null) {
//     const [source, target] = match[1].split(',').map((str) => str.trim());
//     if (source && target) {
//       relations.push({
//         source,
//         target,
//       });
//     }
//   }

//   return relations;
// }

// function extractFields(fieldsString: string): string[] {
//   return fieldsString.split('\n').map((field) => field.trim()).filter(Boolean);
// }
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactFlow, { Background, useNodesState, useEdgesState, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';

const PrismaEditor = () => {
  const [schema, setSchema] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const parsedNodes = parseSchemaToNodes(schema);
    const parsedEdges = parseSchemaToEdges(schema);
    setNodes(parsedNodes);
    setEdges(parsedEdges);
  }, [schema]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Editor
        height="300px"
        defaultLanguage="prisma"
        value={schema}
        onChange={(value) => setSchema(value || '')}
      />
      <div style={{ height: '50%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <Background color="grey" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default PrismaEditor;

function parseSchemaToNodes(schema) {
  const models = extractModels(schema);
  return models.map((model) => ({
    id: model.name,
    data: { label: model.name },
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    type: 'default',
  }));
}

function parseSchemaToEdges(schema) {
  const relations = extractRelations(schema);
  return relations.map((relation) => ({
    id: nanoid(),
    source: relation.source,
    target: relation.target,
    type: 'smoothstep',
  }));
}

function extractModels(schema) {
  const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;
  const models = [];
  let match;

  while ((match = modelRegex.exec(schema)) !== null) {
    models.push({
      name: match[1],
      fields: extractFields(match[2]),
    });
  }

  return models;
}

function extractRelations(schema) {
  const relationRegex = /@relation\((.*?)\)/g;
  const relations = [];
  let match;

  while ((match = relationRegex.exec(schema)) !== null) {
    const [source, target] = match[1].split(',').map((str) => str.trim());
    if (source && target) {
      relations.push({
        source,
        target,
      });
    }
  }

  return relations;
}

function extractFields(fieldsString) {
  return fieldsString.split('\n').map((field) => field.trim()).filter(Boolean);
}
