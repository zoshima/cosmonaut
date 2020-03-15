import * as React from "react";
import Settings from "./Settings";
import QueryEditor from "./QueryEditor";
import QueryResponse from "./QueryResponse";
import {makeStyles, Fab, createStyles, Theme} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import {useEffect, useState, useCallback} from "react";
import {GremlinClientFactory, GremlinClient} from "../cosmos/gremlin-client";
import {CosmosDatabaseClient} from "../cosmos/cosmos-database-client";
import {CosmosClient} from "../cosmos/cosmos-client";
import prettier from "prettier";
import {Configuration} from "../models/configuration.model";
import {useParams} from "react-router-dom";
import {Environment} from "../environment";
import TitleBar from "./TitleBar";

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    grid: {display: "flex", flexDirection: "column"},
    top: {
      display: "flex",
      padding: theme.spacing(1),
      diplay: "flex",
      background: theme.palette.background.paper
    },
    bottom: {flex: 1, display: "flex"},
    editorContainer: {},
    resultContainer: {},
    submitContainer: {},
    bottomContainer: {},
    floatingButton: {
      zIndex: 1,
      position: "fixed",
      bottom: "30px",
      right: "30px"
    }
  })
);

const prettify = (json: string): string => {
  const prettifiedJson: string = prettier.format(json, {
    quoteProps: "as-needed"
  });

  return prettifiedJson;
};

const App: React.FC = () => {
  const params: {id?: string} = useParams();
  const defaultQueryValue: string = "g.V().limit(1)";
  const classes: any = useStyles();

  const settings: Configuration =
    Environment.instance.configurations.find(
      (c: Configuration) => c.id === params.id
    );

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

      const response: {_items: any[]} = await gremlinClient.execute(
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
      <TitleBar showBack={true} title={settings.title} />

      <div className={classes.top}>
        <Settings
          databaseIds={databaseIds}
          containerIds={containerIds}
          onDatabaseSelected={onDatabaseSelected}
          onContainerSelected={onContainerSelected}
        />
      </div>

      <div className={classes.bottom} id="bottomContainer">
        <div className={classes.editorContainer} id="queryContainer">
          <QueryEditor
            defaultValue={defaultQueryValue}
            onChange={onQueryChange}
          />

          <Fab color="primary"
            onClick={onExecute}
            disabled={!(gremlinClient && queryText)}
            className={classes.floatingButton}>
            <SendIcon />
          </Fab>
        </div>

        <div className={classes.resultContainer} id="resultContainer">
          <QueryResponse
            value={queryResult || errorText}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
