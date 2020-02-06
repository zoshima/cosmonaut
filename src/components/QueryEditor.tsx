import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
//@ts-ignore
import { registerRulesForLanguage } from "monaco-ace-tokenizer";
//@ts-ignore
import GremlinHightlightRules from "monaco-ace-tokenizer/lib/ace/definitions/groovy";
import * as electron from "electron";

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

    const win: electron.BrowserWindow = electron.remote.getCurrentWindow();
    let timeout: NodeJS.Timeout;

    // TODO: duplicate in QueryResponse
    win.on("resize", () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        /* const size: number[] = win.getSize(); */
        const rootElement: HTMLElement = document.getElementById("root");
        const size: number[] = [
          rootElement.clientWidth,
          rootElement.clientHeight
        ];

        editor.layout({
          width: 500,
          height: size[1] - 76
        });
      }, 500);
    });
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
