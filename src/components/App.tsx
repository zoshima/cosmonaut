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
  grid: { display: "flex", flexDirection: "column", height: "100%" },
  top: { display: "flex", padding: "10px", diplay: "flex" },
  bottom: { flex: 1, display: "flex" },

  settingsContainer: { flex: 1 },
  editorContainer: { height: "100%", width: "100%" },
  resultContainer: { height: "100%", width: "100%" },
  submitContainer: {}
});

const editorOptions: any = {
  minimap: {
    enabled: false
  },
  automaticLayout: true
};

const App: React.FC = () => {
  const defaultQueryValue: string = "g.V().limit(1)";
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
        onError(err);
      });

    setQueryText(defaultQueryValue);
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
      setContainerIds(containerIds);
      setGremlinClientFactory(clientFactory);
      setGremlinClient(null);
    } catch (err) {
      onError(err);

      setDatabaseClient(null);
      setGremlinClientFactory(null);
      setGremlinClient(null);
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
      onError(err);

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

      setQueryResult(prettify(responseString));
    } catch (err) {
      onError(err);
    }
  };

  const onError = (err: any): void => {
    console.error(err);

    if (err.message) {
      setErrorText(err.message);
    } else {
      setErrorText(prettify(JSON.stringify(err)));
    }
  };

  const prettify = (json: string): string => {
    const prettifiedJson: string = prettier.format(json, {
      quoteProps: "as-needed"
    });

    return prettifiedJson;
  };

  return (
    <div className={classes.grid}>
      <div className={classes.top}>
        <div className={classes.settingsContainer}>
          <Settings
            databaseIds={databaseIds}
            containerIds={containerIds}
            onDatabaseSelected={onDatabaseSelected}
            onContainerSelected={onContainerSelected}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={onExecute}
          disabled={!(gremlinClient && queryText)}
        >
          Exec
        </Button>
      </div>
      <div className={classes.bottom}>
        <div className={classes.editorContainer}>
          <QueryEditor
            defaultValue={defaultQueryValue}
            options={editorOptions}
            onChange={onQueryChange}
          />
        </div>
        <div className={classes.resultContainer}>
          <QueryResponse
            options={editorOptions}
            value={errorText || queryResult}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
