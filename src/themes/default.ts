import {grey, blueGrey} from "@material-ui/core/colors";
import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
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

