import * as React from "react";
import MonacoEditor from "react-monaco-editor";

const QueryEditor: React.FC<{ options: any }> = ({ options }) => {
  return (
    <MonacoEditor
      width="100%"
      height="500px"
      language="groovy"
      theme="vs-dark"
      defaultValue=""
      options={options}
    />
  );
};

export default QueryEditor;
