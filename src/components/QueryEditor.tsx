import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { registerRulesForLanguage } from "monaco-ace-tokenizer";
import GremlinHightlightRules from "monaco-ace-tokenizer/lib/ace/definitions/groovy";

const QueryEditor: React.FC<{
  options: any;
  defaultValue: string;
  onChange: any;
}> = ({ options, onChange, defaultValue }) => {
  const editorWillMount = (monaco: typeof monacoEditor) => {
    monaco.languages.register({
      id: "groovy"
    });

    registerRulesForLanguage("groovy", new GremlinHightlightRules());
  };

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
      editorWillMount={editorWillMount}
    />
  );
};

export default QueryEditor;
