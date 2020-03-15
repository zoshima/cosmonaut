import * as React from "react";

import MonacoEditor from "react-monaco-editor";

import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import {registerRulesForLanguage} from "monaco-ace-tokenizer";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import GremlinHightlightRules from "monaco-ace-tokenizer/lib/ace/definitions/groovy";

import * as electron from "electron";

interface QueryEditorInput {
  defaultValue: string;
  onChange: any;
}

const QueryEditor: React.FC<QueryEditorInput> = (input: QueryEditorInput) => {
  const align = (editor: monacoEditor.editor.IStandaloneCodeEditor): void => {
    const win: electron.BrowserWindow = electron.remote.getCurrentWindow();
    const winSize: number[] = win.getSize();

    console.log("getSize", winSize);
    console.log("getbounds", win.getBounds());

    editor.layout({
      width: 500,
      height: winSize[1] - 80 - 64
    });
  };

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
    align(editor);

    const win: electron.BrowserWindow = electron.remote.getCurrentWindow();
    let timeout: NodeJS.Timeout;

    win.on("resize", () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        align(editor);
      }, 500);
    });
  };

  return (
    <MonacoEditor
      language="groovy"
      theme="vs-dark"
      defaultValue={input.defaultValue}
      onChange={input.onChange}
      editorDidMount={editorDidMount}
      editorWillMount={editorWillMount}
    />
  );
};

export default QueryEditor;
