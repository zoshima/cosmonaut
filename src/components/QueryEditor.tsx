import * as React from "react";
import MonacoEditor from "react-monaco-editor";

const QueryEditor: React.FC<{ options: any; onChange: any }> = ({
  options,
  onChange
}) => {
  return (
    <MonacoEditor
      language="groovy"
      theme="vs-dark"
      defaultValue=""
      options={options}
      onChange={onChange}
    />
  );
};

export default QueryEditor;
