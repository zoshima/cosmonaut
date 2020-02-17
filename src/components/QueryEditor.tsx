import * as React from "react";

import MonacoEditor from "react-monaco-editor";

import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import { registerRulesForLanguage } from "monaco-ace-tokenizer";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import GremlinHightlightRules from "monaco-ace-tokenizer/lib/ace/definitions/groovy";

import * as electron from "electron";

interface QueryEditorInput {
  options: any;
  defaultValue: string;
  onChange: any;
}

const QueryEditor: React.FC<QueryEditorInput> = (input: QueryEditorInput) => {
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
      defaultValue={input.defaultValue}
      options={{ ...input.options, lineNumbers: false }}
      onChange={input.onChange}
      editorDidMount={editorDidMount}
      editorWillMount={editorWillMount}
    />
  );
};

export default QueryEditor;
