import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    WebkitUserSelect: "none",
    WebkitAppRegion: "drag"
  },
  appBar: {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
  },
  closeButton: {
    WebkitAppRegion: "no-drag"
  },
  menuButton: {
    marginRight: theme.spacing(2),
    WebkitAppRegion: "no-drag",
  },
  title: {
    flexGrow: 1,
  },
}));

interface TitleBarProperties {
  showBack: boolean;
  title?: string;
}

const TitleBar: React.FC<TitleBarProperties> = (properties: TitleBarProperties) => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {properties.showBack &&
          <IconButton edge="start" className={classes.menuButton} onClick={() => window.location.href = "#/"}>
            <ArrowBackIcon />
          </IconButton>
        }
        <Typography variant="h6" className={classes.title}>
          {properties.title || "Cosmonaut"}
        </Typography>
        <IconButton className={classes.closeButton} onClick={() => window.close()}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
