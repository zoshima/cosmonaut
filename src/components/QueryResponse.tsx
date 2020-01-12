import * as React from "react";
import MonacoEditor from "react-monaco-editor";

const QueryResponse: React.FC<{ options: any, value: string }> = ({ options, value }) => {
  return (
    <MonacoEditor
      language="json"
      theme="vs-dark"
      value={value}
      options={{ ...options, readOnly: true }}
    />
  );
};

export default QueryResponse;
