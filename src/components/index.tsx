import * as React from "react";
import * as ReactDOM from "react-dom";
import Home from "./Home";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { teal, indigo, blueGrey, cyan } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: blueGrey[500]
    },
    secondary: {
      main: teal[500]
    }
  }
});

const Index = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
