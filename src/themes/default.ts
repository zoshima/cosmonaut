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
      main: "#fb4934",
    },
    warning: {
      main: "#fabd2f"
    },
    info: {
      main: "#458588"
    },
    success: {
      main: "#b8bb26"
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

