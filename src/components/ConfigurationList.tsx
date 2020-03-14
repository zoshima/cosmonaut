import {
  makeStyles,
  GridList,
  GridListTile,
  IconButton,
  GridListTileBar,
  isWidthUp,
  withWidth,
  Fab,
  Link
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Configuration} from "../models/configuration.model";
import LaunchIcon from "@material-ui/icons/Launch";
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

  const [configurations] = useState(Environment.instance.configurations);

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
                  <IconButton href={"#/configuration/" + configuration.id}>
                    <SettingsIcon style={{color: "white"}} />
                  </IconButton>
                }
              />
            </GridListTile>
          );
        })}
      </GridList>

      <Fab color="primary" aria-label="add" href="#/configuration">
        <AddIcon />
      </Fab>
    </div>
  );
};

export default withWidth()(ConfigurationList);
