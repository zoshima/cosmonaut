import * as React from "react";
import * as ReactDOM from "react-dom";
import {ThemeProvider, CssBaseline} from "@material-ui/core";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import {QueryPanel, ConfigurationList} from "src/components";
import {theme} from "src/themes/default";

const Index = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/app/:id">
            <QueryPanel />
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
