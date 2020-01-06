import React, { useEffect, useState } from "react";
import { CosmosClient } from "../cosmos/cosmos-client";
import { makeStyles } from "@material-ui/core";
import DatabaseSelect from "./DatabaseSelect";
import { CosmosDatabaseClient } from "../cosmos/cosmos-database-client";
import ContainerSelect from "./ContainerSelect";
import { GremlinClientFactory, GremlinClient } from "../cosmos/gremlin-client";
import {AppSettings} from "../environment";

interface SettingsProps {
  cosmosClient: CosmosClient;
  appSettings: AppSettings;
}

const useStyles: any = makeStyles({
  form: {
    width: "100%"
  }
});

const Settings: React.FC<SettingsProps> = ({ cosmosClient, appSettings }) => {
  const classes: any = useStyles();

  const [databaseClient, setDatabaseClient] = useState(null);
  const [gremlinClientFactory, setGremlinClientFactory] = useState(null);
  const [gremlinClient, setGremlinClient] = useState(null);

  const [databases, setDatabases] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    cosmosClient.getDatabases().then((databases: string[]) => {
      setDatabases(databases);
    });
  }, []);

  const selectDatabase = async (selectedDatabaseId: string): Promise<void> => {
    if (selectedDatabaseId === databaseClient?.id) {
      return;
    }

    console.log("select database");

    if (gremlinClientFactory) {
      await gremlinClientFactory.destroy();
    }

    const _databaseClient: CosmosDatabaseClient = new CosmosDatabaseClient(
      appSettings.database.hostname,
      appSettings.database.port,
      appSettings.database.key,
      selectedDatabaseId
    );

    const _gremlinClientFactory: GremlinClientFactory = new GremlinClientFactory(
      appSettings.database.hostname,
      appSettings.database.gremlin.port,
      appSettings.database.key,
      selectedDatabaseId
    );

    setDatabaseClient(_databaseClient);
    setGremlinClientFactory(_gremlinClientFactory);

    const containers: string[] = await _databaseClient.getContainers();

    setContainers(containers);
  };

  const selectContainer = async (
    selectedContainerId: string
  ): Promise<void> => {
    if (selectedContainerId === gremlinClient?.containerId) {
      return;
    }

    console.log("select container");

    const _gremlinClient: GremlinClient = await gremlinClientFactory.createClient(
      selectedContainerId
    );

    console.log("vertex count", await _gremlinClient.execute("g.V().count()"));

    setGremlinClient(_gremlinClient);
  };

  return (
    <form className={classes.form} autoComplete="off">
      <DatabaseSelect databases={databases} selectDatabase={selectDatabase} />
      <ContainerSelect
        containers={containers}
        selectContainer={selectContainer}
      />
    </form>
  );
};

export default Settings;
