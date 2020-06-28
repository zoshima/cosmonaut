import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

interface QueryEditorProperties {
  defaultValue: string;
  value: string;
  onChange: any;
}

const QueryEditor: React.FC<QueryEditorProperties> = (properties: QueryEditorProperties) => {
  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ): void => {
    editor.focus();
  };

  return (
    <MonacoEditor
      language="javascript"
      theme="gruvbox"
      defaultValue={properties.defaultValue}
      value={properties.value}
      onChange={properties.onChange}
      editorDidMount={editorDidMount}
      options={{ minimap: { enabled: false }, automaticLayout: true, wordWrap: "on" }}
    />
  );
};

export default QueryEditor;
