import {grey, blueGrey, teal, pink, cyan} from "@material-ui/core/colors";
import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#1e1e1e",
      paper: "#333333"
    },
    primary: {
      main: teal[200]
    },
    secondary: {
      main: pink[500]
    }
  },
  typography: {
    fontFamily: "Roboto"
  }
});

