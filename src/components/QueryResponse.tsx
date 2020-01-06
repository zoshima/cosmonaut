import * as React from "react";
import MonacoEditor from "react-monaco-editor";

const QueryResponse: React.FC<{ options: any }> = ({ options }) => {
  return (
    <MonacoEditor
      width="100%"
      height="500px"
      language="json"
      theme="vs-dark"
      defaultValue=""
      options={{ ...options, readOnly: true }}
    />
  );
};

export default QueryResponse;
