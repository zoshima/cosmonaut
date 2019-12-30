import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hello } from "./hello";

const Index = () => {
  return <Hello name="World"/>;
};

ReactDOM.render(<Index />, document.getElementById("root"));
