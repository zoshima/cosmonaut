import * as React from "react";
import {
  makeStyles,
  Fab,
  Theme,
  Drawer,
  Button,
  Divider,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import { useEffect, useState, useCallback } from "react";
import prettier from "prettier";
import { useParams } from "react-router-dom";
import { Environment } from "src/environment";
import {
  CosmosClient,
  CosmosDatabaseClient,
  GremlinClient,
  GremlinClientFactory,
} from "src/cosmos";
import { Configuration } from "src/models";
import {
  QueryPanelSettings,
  QueryResponse,
  QueryEditor,
  TitleBar,
  AccordionDivider,
  QueryPanelStatusBar,
} from "src/components";

const useStyles: any = makeStyles((theme: Theme) => ({
  grid: { display: "flex", flexDirection: "column", height: "100vh" },
  top: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.divider,
  },
  topLeft: {},
  topRight: {
    display: "flex",
    alignItems: "center",
  },
  actionsContainer: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(2),
  },
  drawer: {
    width: "100vw",
    height: "50vh",
    overflow: "hidden",
  },
  bottom: { flex: 1, overflow: "hidden" },
  editorContainer: {},
  resultContainer: {},
  submitContainer: {},
  bottomContainer: {},
  floatingButton: {
    zIndex: 1,
    position: "fixed",
    bottom: "30px",
    right: "30px",
  },
}));

const prettify = (json: string): string => {
  const prettifiedJson: string = prettier.format(json, {
    quoteProps: "as-needed",
  });

  return prettifiedJson;
};

const QueryPanel: React.FC = () => {
  const params: { id?: string } = useParams();
  const defaultQueryValue: string = "g.V().limit(1)";
  const classes: any = useStyles();

  const settings: Configuration = Environment.instance.configurations.find(
    (c: Configuration) => c.id === params.id
  );

  const [databaseIds, setDatabaseIds] = useState([]);
  const [containerIds, setContainerIds] = useState([]);
  const [databaseClient, setDatabaseClient] = useState(null);
  const [gremlinClientFactory, setGremlinClientFactory] = useState(null);
  const [gremlinClient, setGremlinClient] = useState(null);
  const [queryText, setQueryText] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [errorText, setErrorText] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusText, setStatusText] = useState(null);
  const [executionProfileEnabled, setExecutionProfileEnabled] = useState(false);

  const onError = useCallback((err: any): void => {
    console.error(err);

    if (err.message) {
      setErrorText(err.message);
    } else {
      setErrorText(prettify(JSON.stringify(err)));
    }

    setIsDrawerOpen(true);
  }, []);

  useEffect(() => {
    console.log("main useEffect()");

    const cosmosClient: CosmosClient = new CosmosClient(
      settings.cosmos.protocol,
      settings.cosmos.hostname,
      settings.cosmos.port,
      settings.key
    );

    setStatusText("retrieving databases");

    cosmosClient
      .getDatabases()
      .then((databaseIds: string[]) => {
        setDatabaseIds(databaseIds);
      })
      .catch((err) => {
        onError(err);
      })
      .finally(() => {
        setStatusText(null);
      });

    setQueryText(defaultQueryValue);
  }, [settings, onError]);

  const onDatabaseSelected = async (databaseId: string): Promise<void> => {
    try {
      setStatusText(`connecting to '${databaseId}'`);

      if (gremlinClientFactory) {
        await gremlinClientFactory.destroy();
      }

      const databaseClient: CosmosDatabaseClient = new CosmosDatabaseClient(
        settings.cosmos.protocol,
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
    } finally {
      setStatusText(null);
    }
  };

  const onContainerSelected = async (containerId: string): Promise<void> => {
    setStatusText(`connecting to '${containerId}'`);

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
    } finally {
      setStatusText(null);
    }
  };

  const onExecutionProfileToggled = async (
    isChecked: boolean
  ): Promise<void> => {
    setExecutionProfileEnabled(isChecked);
  };

  const onExecute = async (): Promise<void> => {
    setStatusText("querying");
    setErrorText(null);
    setQueryResult(null);

    let responseJson: any;

    try {
      if (!gremlinClient.isOpen) {
        await gremlinClient.open();
      }

      const query = `${queryText}${
        executionProfileEnabled ? ".executionProfile()" : ""
      }`;

      const response: {
        _items: any[];
        attributes: { "x-ms-total-request-charge": number };
      } = await gremlinClient.execute(query);

      responseJson = response._items;

      const responseString: string = JSON.stringify(responseJson);

      setQueryResult(prettify(responseString));
      setStatusText(
        "Request charge: " +
          response.attributes["x-ms-total-request-charge"].toFixed(2)
      );
    } catch (err) {
      onError(err);
      setStatusText(null);
    } finally {
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className={classes.grid}>
      <TitleBar showBack={true} />

      <div className={classes.top}>
        <div className={classes.topLeft}>
          <QueryPanelSettings
            databaseIds={databaseIds}
            containerIds={containerIds}
            onDatabaseSelected={onDatabaseSelected}
            onContainerSelected={onContainerSelected}
            onExecutionProfileToggled={onExecutionProfileToggled}
          />
        </div>

        <div className={classes.topRight}>
          <Divider orientation="vertical" flexItem />
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={onExecute}
              disabled={!(gremlinClient && queryText)}
            >
              Execute
            </Button>
          </div>
        </div>
      </div>

      <div className={classes.bottom} id="bottomContainer">
        <QueryEditor
          defaultValue={defaultQueryValue}
          onChange={(val: string) => {
            setQueryText(val);
          }}
        />
      </div>

      {(queryResult || errorText) && (
        <div>
          <AccordionDivider
            direction="up"
            onClick={() => setIsDrawerOpen(true)}
          />
        </div>
      )}

      <Drawer
        variant="persistent"
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div className={classes.drawer}>
          <AccordionDivider
            direction="down"
            onClick={() => setIsDrawerOpen(false)}
          />
          <QueryResponse value={queryResult || errorText} />
        </div>
      </Drawer>

      <QueryPanelStatusBar
        profileName={settings.title}
        databaseName={databaseClient?.id}
        containerName={gremlinClient?.containerId}
        statusMessage={statusText}
        errorMessage={errorText}
        isConnected={gremlinClient?.isOpen}
      />
    </div>
  );
};

export default QueryPanel;
