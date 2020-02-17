import {
  makeStyles,
  GridList,
  GridListTile,
  IconButton,
  GridListTileBar
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Configuration } from "../models/configuration.model";
import LaunchIcon from "@material-ui/icons/Launch";

const useStyles: any = makeStyles({
  logo: {
    width: "100%"
  }
});

const _configurations: Configuration[] = [
  {
    title: "***REMOVED***",
    description: "Remote",
    img: "./assets/img/azure_logo.svg",
    key:
      "***REMOVED***",
    cosmos: {
      protocol: "https",
      hostname: "***REMOVED***.documents.azure.com",
      port: 443
    },
    gremlin: {
      protocol: "wss",
      hostname: "***REMOVED***.gremlin.cosmosdb.azure.com",
      port: 443
    }
  }
];

console.log(_configurations);

const Home: React.FC = () => {
  const classes: any = useStyles();

  const [configurations, setConfigurations] = useState(_configurations);

  useEffect(() => {
    setConfigurations(_configurations);
  }, []);

  return (
    <GridList cellHeight={150} className={classes.gridList} cols={3}>
      {configurations.map((configuration: Configuration) => {
        return (
          <GridListTile key={configuration.img} cols={1}>
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
                <IconButton>
                  <LaunchIcon style={{ color: "white" }} />
                </IconButton>
              }
            />
          </GridListTile>
        );
      })}
    </GridList>
  );
};

export default Home;
