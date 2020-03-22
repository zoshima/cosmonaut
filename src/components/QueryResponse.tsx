import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

const QueryResponse: React.FC<{value: string}> = ({
  value
}) => {
  let previousValue: string;

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) => {
    editor.onDidChangeModelContent((e: monacoEditor.editor.IModelContentChangedEvent) => {
      const newValue: string = e.changes[0].text;

      if (previousValue != newValue) {
        previousValue = newValue;
        editor.setPosition({lineNumber: 0, column: 0});
      }
    });
  };

  return (
    <MonacoEditor
      language="json"
      theme="vs-dark"
      value={value}
      options={{readOnly: true, minimap: {enabled: false}, automaticLayout: true}}
      editorDidMount={editorDidMount}
    />
  );
};

export default QueryResponse;
