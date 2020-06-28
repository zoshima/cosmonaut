import * as React from "react";

import MonacoEditor from "react-monaco-editor";

import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import { registerRulesForLanguage } from "monaco-ace-tokenizer";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import GremlinHightlightRules from "monaco-ace-tokenizer/lib/ace/definitions/groovy";

interface QueryEditorProperties {
  defaultValue: string;
  value: string;
  onChange: any;
}

const QueryEditor: React.FC<QueryEditorProperties> = (properties: QueryEditorProperties) => {
  const editorWillMount = (monaco: typeof monacoEditor): void => {
    monaco.languages.register({
      id: "groovy"
    });

    registerRulesForLanguage("groovy", new GremlinHightlightRules());
  };

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ): void => {
    editor.focus();
  };

  return (
    <MonacoEditor
      language="groovy"
      theme="gruvbox"
      defaultValue={properties.defaultValue}
      value={properties.value}
      onChange={properties.onChange}
      editorDidMount={editorDidMount}
      editorWillMount={editorWillMount}
      options={{ minimap: { enabled: false }, automaticLayout: true, wordWrap: "on" }}
    />
  );
};

export default QueryEditor;
