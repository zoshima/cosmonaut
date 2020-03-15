import {
  makeStyles,
  GridList,
  GridListTile,
  IconButton,
  GridListTileBar,
  isWidthUp,
  withWidth,
  Fab,
  Menu,
  MenuItem,
  Theme,
  createStyles
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Configuration} from "../models/configuration.model";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LaunchIcon from '@material-ui/icons/Launch';
import AddIcon from "@material-ui/icons/Add";
import {Environment} from "../environment";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import TitleBar from "./TitleBar";
import ConfigurationForm from "./ConfigurationForm";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    gridList: {
      padding: theme.spacing(1)
    },
    logo: {
      width: "100%",
      height: "100%"
    },
    floatingButton: {
      position: "fixed",
      bottom: "30px",
      right: "30px"
    }
  })
);

const ConfigurationList: React.FC = (properties: any) => {
  const classes: any = useStyles();

  const [configurations, setConfigurations] = useState(Environment.instance.configurations);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean | Configuration>(false);

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

  const openDialog = (configuration?: Configuration): void => {
    setIsDialogOpen(configuration || true);
  };

  const closeDialog = (shouldReload: boolean): void => {
    setIsDialogOpen(false);

    if (shouldReload) {
      setConfigurations(Environment.instance.configurations);
    }
  };

  const openMenu = (event: React.MouseEvent, configuration: Configuration): void => {
    console.log(event);
    setMenuAnchor({target: event.currentTarget, configuration: configuration});
  };

  const closeMenu = (): void => {
    setMenuAnchor(null);
  };

  const editConfiguration = (configuration: Configuration): void => {
    /* window.location.href = "#/configuration/" + configuration.id; */
    openDialog(configuration);
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
      <TitleBar showBack={false} />
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
                  <div>
                    <IconButton href={"#/app/" + configuration.id}>
                      <LaunchIcon />
                    </IconButton>
                    <IconButton onClick={(event: any) => openMenu(event, configuration)}>
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                }
              />
            </GridListTile>
          );
        })}
      </GridList>

      <Menu
        anchorEl={menuAnchor?.target}
        open={Boolean(menuAnchor?.target)}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => editConfiguration(menuAnchor.configuration)}>Edit</MenuItem>
        <MenuItem onClick={() => cloneConfiguration(menuAnchor.configuration)}>Clone</MenuItem>
        <MenuItem onClick={() => deleteConfiguration(menuAnchor.configuration)}>Delete</MenuItem>
      </Menu>

      <ConfigurationForm isOpen={!!isDialogOpen} onClose={closeDialog} id={(isDialogOpen as Configuration).id} />

      <Fab color="primary" className={classes.floatingButton} onClick={() => openDialog()}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default withWidth()(ConfigurationList);
