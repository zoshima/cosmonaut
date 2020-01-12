import * as React from "react";
import { Environment, AppSettings } from "../environment";
import Settings from "./Settings";
import QueryEditor from "./QueryEditor";
import QueryResponse from "./QueryResponse";
import { Grid, makeStyles, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { GremlinClientFactory, GremlinClient } from "../cosmos/gremlin-client";

const prettier: any = require("prettier");
const settings: AppSettings = Environment.instance.settings;

const useStyles: any = makeStyles({
  grid: { padding: "8px 8px 0px 8px", height: "100%" },
  editorContainer: { height: "100px" },
  resultContainer: { height: "100%" },
  submitContainer: {}
});

const editorOptions: any = {
  minimap: {
    enabled: false
  }
};

const App: React.FC = () => {
  const classes: any = useStyles();

  const [databaseId, setDatabaseId] = useState(null);
  const [containerId, setContainerId] = useState(null);
  const [queryText, setQueryText] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  useEffect(() => {
  });

  const onDatabaseSelected = (databaseId: string): void => {
    setDatabaseId(databaseId);
    setContainerId(null);
  };

  const onContainerSelected = (containerId: string): void => {
    setContainerId(containerId);
  };

  const onQueryChange = (query: string): void => {
    setQueryText(query);
  };

  const onExecute = async (): Promise<void> => {
    // TODO: instantiate on database id change
    const clientFactory: GremlinClientFactory = new GremlinClientFactory(
      settings.database.gremlin.hostname,
      settings.database.gremlin.port,
      settings.database.key,
      databaseId
    );

    // TODO: instantiate on container id change
    const client: GremlinClient = await clientFactory.createClient(containerId, false);

    let responseJson: any;

    try {
      await client.open();
      const response: { _items: any[] } = await client.execute(queryText);
      responseJson = response._items;
      await client.close();
    } catch (e) {
      responseJson = [{ name: e.name, statusCode: e.statusCode, statusMessage: e.statusMessage }];
    }

    const responseString: string = JSON.stringify(responseJson);
    const formattedResponseString: string = prettier.format(responseString, { quoteProps: "as-needed" });

    setQueryResult(formattedResponseString);
  };

  return (
    <Grid className={classes.grid} container spacing={1}>
      <Grid item xs={12}>
        <Settings
          onDatabaseSelected={onDatabaseSelected}
          onContainerSelected={onContainerSelected}
        />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.editorContainer}>
          <QueryEditor options={editorOptions} onChange={onQueryChange} />
        </div>
      </Grid>
      <Grid item xs={12} justify="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={onExecute}
          disabled={!(databaseId && containerId && queryText)}
          >
            Execute
          </Button>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.resultContainer}>
          <QueryResponse options={editorOptions} value={queryResult} />
        </div>
      </Grid>
    </Grid>
  );
};

export default App;
