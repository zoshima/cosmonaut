import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

const QueryResponse: React.FC<{ options: any; value: string }> = ({
  options,
  value
}) => {
  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) => {
    editor.onDidChangeModelContent(() => {
      editor.setPosition({ lineNumber: 0, column: 0 });
    });
  };

  return (
    <MonacoEditor
      language="json"
      theme="vs-dark"
      value={value}
      options={{ ...options, readOnly: true }}
      editorDidMount={editorDidMount}
    />
  );
};

export default QueryResponse;
