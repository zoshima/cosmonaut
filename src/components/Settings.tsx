import React, { useEffect, useState } from "react";
import { CosmosClient } from "../cosmos/cosmos-client";
import { makeStyles } from "@material-ui/core";
import DatabaseSelect from "./DatabaseSelect";

interface SettingsProps {
  cosmosClient: CosmosClient;
}

const useStyles: any = makeStyles({
  form: {
    width: "100%"
  }
});

const Settings = (props: SettingsProps) => {
  const classes: any = useStyles();

  const [database, setDatabase] = useState(null);
  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    props.cosmosClient.getDatabases().then((databases: string[]) => {
      setDatabases(databases);
    });
  });

  const selectDatabase = (selectedDatabase: string): void => {
    if (selectedDatabase === database?.id) {
      return;
    }

    console.log("reconnect", database, selectedDatabase);

    setDatabase(selectedDatabase);
  };

  return (
    <form className={classes.form} autoComplete="off">
      <DatabaseSelect databases={databases} selectDatabase={selectDatabase} />
    </form>
  );
};

export default Settings;
