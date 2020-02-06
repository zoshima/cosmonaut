import * as React from "react";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import * as electron from "electron";

const QueryResponse: React.FC<{ options: any; value: string }> = ({
  options,
  value
}) => {
  const editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) => {
    /* editor.onDidChangeModelContent(() => { */
    /*   editor.setPosition({ lineNumber: 0, column: 0 }); */
    /* }); */

    const win: electron.BrowserWindow = electron.remote.getCurrentWindow();
    let timeout: NodeJS.Timeout;

    // TODO: duplicate in QueryEditor
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
          width: size[0] - 500,
          height: size[1] - 76
        });
      }, 500);
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
