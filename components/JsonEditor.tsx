'use client';

import { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function JsonEditor({ value, onChange, readOnly = false }: JsonEditorProps) {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;

    // Configure JSON language features
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Prevent default save behavior
      // The actual save will be handled by the parent component
    });
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  );
}
