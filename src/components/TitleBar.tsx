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
  closeButton: {
    WebkitAppRegion: "no-drag"
  },
  menuButton: {
    marginRight: theme.spacing(2),
    WebkitAppRegion: "no-drag"
  },
  title: {
    flexGrow: 1,
  },
}));

interface TitleBarInput {
  showBack: boolean;
  title?: string;
}

const TitleBar: React.FC<TitleBarInput> = (input: TitleBarInput) => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        {input.showBack &&
          <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={() => window.location.href = "#/"}>
            <ArrowBackIcon />
          </IconButton>
        }
        <Typography variant="h6" className={classes.title}>
          {input.title || "Cosmonaut"}
        </Typography>
        <IconButton className={classes.closeButton} onClick={() => window.close()}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
