import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

const QueryEditor: React.FC<{
  options: any;
  defaultValue: string;
  onChange: any;
}> = ({ options, onChange, defaultValue }) => {
  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) => {
    editor.focus();
  };

  return (
    <MonacoEditor
      language="groovy"
      theme="vs-dark"
      defaultValue={defaultValue}
      options={{ ...options, lineNumbers: false }}
      onChange={onChange}
      editorDidMount={editorDidMount}
    />
  );
};

export default QueryEditor;
