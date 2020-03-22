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
  WithWidthProps,
  Typography,
  ListSubheader
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LaunchIcon from '@material-ui/icons/Launch';
import AddIcon from "@material-ui/icons/Add";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {Environment} from "src/environment";
import {Configuration} from "src/models";
import {ConfigurationForm, TitleBar} from "src/components";

const useStyles: any = makeStyles((theme: Theme) =>
  ({
    gridList: {
      padding: theme.spacing(1),
      margin: theme.spacing(0),
      flexGrow: 0,
      maxWidth: `100%`,
      flexBasis: `100%`
    },
    logo: {
      width: "100%",
      height: "100%"
    },
    floatingButton: {
      position: "fixed",
      bottom: "30px",
      right: "30px"
    },
    titleBar: {
      color: theme.palette.background.paper
    },
    title: {
      color: theme.palette.primary.main
    },
    subtitle: {
      color: theme.palette.text.primary
    }
  })
);

const ConfigurationList: React.FC<WithWidthProps> = (properties: WithWidthProps) => {
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
        <GridListTile key="Subheader" cols={calculateColumns()} style={{height: 'auto'}}>
          <ListSubheader component="div">
            <Typography variant="h6" gutterBottom>Local</Typography>
          </ListSubheader>
        </GridListTile>

        {configurations.filter((c: Configuration) => !c.img.includes("azure")).map((configuration: Configuration) => {
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
                  title: classes.title,
                  subtitle: classes.subtitle
                }}
                actionIcon={
                  <div>
                    <IconButton
                      href={"#/app/" + configuration.id}
                      className={classes.subtitle}
                    >
                      <LaunchIcon />
                    </IconButton>
                    <IconButton
                      onClick={(event: any) => openMenu(event, configuration)}
                      className={classes.subtitle}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                }
              />
            </GridListTile>
          );
        })}
      </GridList>

      <GridList
        cellHeight={150}
        className={classes.gridList}
        cols={calculateColumns()}
      >
        <GridListTile key="Subheader" cols={calculateColumns()} style={{height: 'auto'}}>
          <ListSubheader component="div">
            <Typography variant="h6" gutterBottom>Remote</Typography>
          </ListSubheader>
        </GridListTile>

        {configurations.filter((c: Configuration) => c.img.includes("azure")).map((configuration: Configuration) => {
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
                  title: classes.title,
                  subtitle: classes.subtitle
                }}
                actionIcon={
                  <div>
                    <IconButton
                      href={"#/app/" + configuration.id}
                      className={classes.subtitle}
                    >
                      <LaunchIcon />
                    </IconButton>
                    <IconButton
                      onClick={(event: any) => openMenu(event, configuration)}
                      className={classes.subtitle}
                    >
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

      <Fab color="secondary" className={classes.floatingButton} onClick={() => openDialog()}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default withWidth()(ConfigurationList);
