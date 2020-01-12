import * as React from "react";
import MonacoEditor from "react-monaco-editor";

const QueryResponse: React.FC<{ options: any }> = ({ options }) => {
  return (
    <MonacoEditor
      language="json"
      theme="vs-dark"
      defaultValue=""
      options={{ ...options, readOnly: true }}
    />
  );
};

export default QueryResponse;
