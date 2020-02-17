import * as React from "react";
import Settings from "./Settings";
import QueryEditor from "./QueryEditor";
import QueryResponse from "./QueryResponse";
import { makeStyles, Button, IconButton } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { useEffect, useState, useCallback } from "react";
import { GremlinClientFactory, GremlinClient } from "../cosmos/gremlin-client";
import { CosmosDatabaseClient } from "../cosmos/cosmos-database-client";
import { CosmosClient } from "../cosmos/cosmos-client";
import prettier from "prettier";
import { Configuration } from "../models/configuration.model";

const useStyles: any = makeStyles({
  grid: { display: "flex", flexDirection: "column", height: "100%" },
  top: { display: "flex", padding: "10px", diplay: "flex" },
  bottom: { flex: 1, display: "flex" },
  settingsContainer: { flex: 1 },
  editorContainer: { height: "100%", width: "500px" },
  resultContainer: { height: "100%", flex: 1, flexShrik: 1 },
  submitContainer: {}
});

const editorOptions: any = {
  minimap: {
    enabled: false
  }
};

const prettify = (json: string): string => {
  const prettifiedJson: string = prettier.format(json, {
    quoteProps: "as-needed"
  });

  return prettifiedJson;
};

const App: React.FC<Configuration> = (settings: Configuration) => {
  const defaultQueryValue: string = "g.V().limit(1)";
  const classes: any = useStyles();

  const [databaseIds, setDatabaseIds] = useState([]);
  const [containerIds, setContainerIds] = useState([]);
  const [, setDatabaseClient] = useState(null);
  const [gremlinClientFactory, setGremlinClientFactory] = useState(null);
  const [gremlinClient, setGremlinClient] = useState(null);
  const [queryText, setQueryText] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [errorText, setErrorText] = useState(null);

  const onError = useCallback((err: any): void => {
    console.error(err);

    if (err.message) {
      setErrorText(err.message);
    } else {
      setErrorText(prettify(JSON.stringify(err)));
    }
  }, []);

  useEffect(() => {
    console.log("main useEffect()");

    const cosmosClient: CosmosClient = new CosmosClient(
      settings.cosmos.hostname,
      settings.cosmos.port,
      settings.key
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
  }, [settings, onError]);

  const onDatabaseSelected = async (databaseId: string): Promise<void> => {
    try {
      if (gremlinClientFactory) {
        await gremlinClientFactory.destroy();
      }

      const databaseClient: CosmosDatabaseClient = new CosmosDatabaseClient(
        settings.cosmos.hostname,
        settings.cosmos.port,
        settings.key,
        databaseId
      );

      const clientFactory: GremlinClientFactory = new GremlinClientFactory(
        settings.gremlin.protocol,
        settings.gremlin.hostname,
        settings.gremlin.port,
        settings.key,
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

    setQueryResult(null);

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

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={onExecute}
            disabled={!(gremlinClient && queryText)}
          >
            Exec
          </Button>

          <IconButton color="primary">
            <SettingsIcon />
          </IconButton>
        </div>
      </div>

      <div className={classes.bottom} id="bottomContainer">
        <div className={classes.editorContainer} id="queryContainer">
          <QueryEditor
            defaultValue={defaultQueryValue}
            options={editorOptions}
            onChange={onQueryChange}
          />
        </div>

        <div className={classes.resultContainer} id="resultContainer">
          <QueryResponse
            options={editorOptions}
            value={queryResult || errorText}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
