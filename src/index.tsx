import * as React from "react";
import * as ReactDOM from "react-dom";
import {ThemeProvider, createMuiTheme, CssBaseline} from "@material-ui/core";
import {grey, blueGrey} from "@material-ui/core/colors";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import {QueryPanel, ConfigurationList} from "src/components";

const theme = createMuiTheme({
  palette: {
    type: "light",
    background: {
      default: blueGrey[200]
    },
    primary: {
      main: blueGrey[800]
    },
    secondary: {
      main: grey[500]
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
