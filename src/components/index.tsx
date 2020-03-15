import * as React from "react";
import * as ReactDOM from "react-dom";
import {ThemeProvider, createMuiTheme, CssBaseline} from "@material-ui/core";
import {teal, blueGrey, indigo, cyan} from "@material-ui/core/colors";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import ConfigurationList from "./ConfigurationList";
import App from "./App";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: blueGrey[500]
    },
    secondary: {
      main: blueGrey[500]
    }
  },
  typography: {
    fontFamily: "Roboto"
  }
});

const Index = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/app/:id">
            <App />
          </Route>
          <Route path="/">
            <ConfigurationList />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
