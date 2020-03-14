import {
  makeStyles,
  GridList,
  GridListTile,
  IconButton,
  GridListTileBar,
  isWidthUp,
  withWidth,
  Fab,
  Link,
  Menu,
  MenuItem
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Configuration} from "../models/configuration.model";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from "@material-ui/icons/Add";
import SettingsIcon from "@material-ui/icons/Settings";
import {Environment} from "../environment";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

const useStyles: any = makeStyles({
  gridList: {
    padding: "10px"
  },
  logo: {
    width: "100%",
    height: "100%"
  }
});

const ConfigurationList: React.FC = (properties: any) => {
  const classes: any = useStyles();

  const [configurations, setConfigurations] = useState(Environment.instance.configurations);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    console.log("useEffect", "Home");
  }, []);

  const calculateColumns: any = (): number => {
    const breakpointMap: any = {
      xl: 6,
      lg: 4,
      md: 3,
      sm: 2
    };

    for (const breakpoint in breakpointMap) {
      if (isWidthUp(breakpoint as Breakpoint, properties.width)) {
        return breakpointMap[breakpoint];
      }
    }

    return 1;
  };

  const onMenuOpen = (event: React.MouseEvent, configuration: Configuration): void => {
    console.log(event);
    setMenuAnchor({target: event.currentTarget, configuration: configuration});
  };

  const onMenuClose = (): void => {
    setMenuAnchor(null);
  };

  const editConfiguration = (configuration: Configuration): void => {
    window.location.href = "#/configuration/" + configuration.id;
    setMenuAnchor(null);
  };

  const deleteConfiguration = (configuration: Configuration): void => {
    if (window.confirm(`Are you sure you wish to delete '${configuration.title}'?`)) {
      Environment.instance.deleteConfiguration(configuration);
    }

    setMenuAnchor(null);
    setConfigurations(Environment.instance.configurations);
  };

  const cloneConfiguration = (configuration: Configuration): void => {
    const _configuration: Configuration = {...configuration, id: Date.now() + ""};
    Environment.instance.setConfiguration(_configuration);

    setMenuAnchor(null);
    setConfigurations(Environment.instance.configurations);
  };

  return (
    <div>
      <GridList
        cellHeight={150}
        className={classes.gridList}
        cols={calculateColumns()}
      >
        {configurations.map((configuration: Configuration) => {
          return (
            <GridListTile key={configuration.id} cols={1}>
              <img
                src={configuration.img}
                alt={configuration.title}
                className={classes.logo}
              />
              <GridListTileBar
                title={configuration.title}
                subtitle={configuration.description}
                classes={{
                  root: classes.titleBar,
                  title: classes.title
                }}
                actionIcon={
                  /* <IconButton > */
                  <IconButton onClick={(event: any) => onMenuOpen(event, configuration)}>
                    <MoreVertIcon style={{color: "white"}} />
                  </IconButton>
                }
              />
            </GridListTile>
          );
        })}
      </GridList>

      <Menu
        anchorEl={menuAnchor?.target}
        open={Boolean(menuAnchor?.target)}
        onClose={onMenuClose}
      >
        <MenuItem onClick={() => editConfiguration(menuAnchor.configuration)}>Edit</MenuItem>
        <MenuItem onClick={() => cloneConfiguration(menuAnchor.configuration)}>Clone</MenuItem>
        <MenuItem onClick={() => deleteConfiguration(menuAnchor.configuration)}>Delete</MenuItem>
      </Menu>

      <Fab color="primary" href="#/configuration">
        <AddIcon />
      </Fab>
    </div>
  );
};

export default withWidth()(ConfigurationList);
