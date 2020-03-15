import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import * as electron from "electron";
import {Environment} from "../environment";

const QueryResponse: React.FC<{value: string}> = ({
  value
}) => {
  const align = (editor: monacoEditor.editor.IStandaloneCodeEditor): void => {
    const win: electron.BrowserWindow = electron.remote.getCurrentWindow();
    const winSize: number[] = win.getSize();

    editor.layout({
      width: winSize[0] - 500,
      height: winSize[1] - 80 - 64
    });
  };

  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) => {
    /* editor.onDidChangeModelContent(() => { */
    /*   editor.setPosition({ lineNumber: 0, column: 0 }); */
    /* }); */
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
      language="json"
      theme="vs-dark"
      value={value}
      options={{readOnly: true}}
      editorDidMount={editorDidMount}
    />
  );
};

export default QueryResponse;
