import {createMuiTheme} from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#282828",
      paper: "#3c3836"
    },
    primary: {
      main: "#fe8019"
    },
    secondary: {
      main: "#8ec07c"
    },
    error: {
      main: "#cc241d",
    },
    warning: {
      main: "#d79921"
    },
    info: {
      main: "#458588"
    },
    success: {
      main: "#98971a"
    },
    text: {
      primary: "#fbf1c7",
      secondary: "#ebdbb2",
      disabled: "#a89984"
    }
  },
  typography: {
    fontFamily: "Roboto"
  }
});

