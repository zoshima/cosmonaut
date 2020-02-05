import * as React from "react";
import { Environment, AppSettings } from "../environment";
import Settings from "./Settings";
import QueryEditor from "./QueryEditor";
import QueryResponse from "./QueryResponse";
import { Grid, makeStyles, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { GremlinClientFactory, GremlinClient } from "../cosmos/gremlin-client";
import { CosmosDatabaseClient } from "../cosmos/cosmos-database-client";
import { CosmosClient } from "../cosmos/cosmos-client";

const prettier: any = require("prettier");
const settings: AppSettings = Environment.instance.settings;

const useStyles: any = makeStyles({
  grid: { height: "100%" },
  settingsContainer: {},
  editorContainer: { height: "591px" },
  resultContainer: { height: "591px" },
  submitContainer: {}
});

const editorOptions: any = {
  minimap: {
    enabled: false
  }
};

const App: React.FC = () => {
  const classes: any = useStyles();

  const [databaseIds, setDatabaseIds] = useState([]);
  const [containerIds, setContainerIds] = useState([]);

  const [databaseClient, setDatabaseClient] = useState(null);
  const [gremlinClientFactory, setGremlinClientFactory] = useState(null);
  const [gremlinClient, setGremlinClient] = useState(null);

  const [queryText, setQueryText] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [errorText, setErrorText] = useState(null);

  useEffect(() => {
    console.log("main useEffect()");

    const cosmosClient: CosmosClient = new CosmosClient(
      settings.database.hostname,
      settings.database.port,
      settings.database.key
    );

    cosmosClient
      .getDatabases()
      .then((databaseIds: string[]) => {
        setDatabaseIds(databaseIds);
      })
      .catch(err => {
        setErrorText(JSON.stringify(err));
      });
  }, []);

  const onDatabaseSelected = async (databaseId: string): Promise<void> => {
    try {
      if (gremlinClientFactory) {
        await gremlinClientFactory.destroy();
      }

      const databaseClient: CosmosDatabaseClient = new CosmosDatabaseClient(
        settings.database.hostname,
        settings.database.port,
        settings.database.key,
        databaseId
      );

      const clientFactory: GremlinClientFactory = new GremlinClientFactory(
        settings.database.gremlin.protocol,
        settings.database.gremlin.hostname,
        settings.database.gremlin.port,
        settings.database.key,
        databaseId,
        true
      );

      const containerIds = await databaseClient.getContainers();

      setDatabaseClient(databaseClient);
      setGremlinClientFactory(clientFactory);
      setContainerIds(containerIds);
    } catch (err) {
      setErrorText(JSON.stringify(err));

      setDatabaseClient(null);
      setGremlinClientFactory(null);
      setContainerIds(null);
    }
  };

  const onContainerSelected = async (containerId: string): Promise<void> => {
    if (gremlinClient && gremlinClient.isOpen) {
      await gremlinClient.close();
    }

    try {
      const client: GremlinClient = await gremlinClientFactory.createClient(
        containerId,
        false
      );

      setGremlinClient(client);
    } catch (err) {
      setErrorText(JSON.stringify(err));

      setGremlinClient(null);
    }
  };

  const onQueryChange = (query: string): void => {
    setQueryText(query);
  };

  const onExecute = async (): Promise<void> => {
    let responseJson: any;

    try {
      if (!gremlinClient.isOpen) {
        await gremlinClient.open();
      }

      const response: { _items: any[] } = await gremlinClient.execute(
        queryText
      );
      responseJson = response._items;

      const responseString: string = JSON.stringify(responseJson);
      const formattedResponseString: string = prettier.format(responseString, {
        quoteProps: "as-needed"
      });

      setQueryResult(formattedResponseString);
    } catch (err) {
      setErrorText(JSON.stringify(err));
    }
  };

  return (
    <Grid className={classes.grid} container spacing={0}>
      <Grid item xs={12}>
        <div className={classes.settingsContainer}>
          <Settings
            databaseIds={databaseIds}
            containerIds={containerIds}
            onDatabaseSelected={onDatabaseSelected}
            onContainerSelected={onContainerSelected}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className={classes.editorContainer}>
          <QueryEditor options={editorOptions} onChange={onQueryChange} />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className={classes.resultContainer}>
          <QueryResponse
            options={editorOptions}
            value={errorText || queryResult}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default App;

// <Button variant="contained" color="primary" onClick={onExecute}>
//   Execute
// </Button>
