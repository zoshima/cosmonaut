import * as React from "react";
import * as ReactDOM from "react-dom";
import {ThemeProvider, createMuiTheme} from "@material-ui/core";
import {teal, blueGrey} from "@material-ui/core/colors";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import ConfigurationList from "./ConfigurationList";
import ConfigurationForm from "./ConfigurationForm";

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
      <Router>
        <Switch>
          <Route path="/configuration">
            <ConfigurationForm />
          </Route>
          <Route path="/configuration/:id">
            <ConfigurationForm />
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
