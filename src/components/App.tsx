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
  grid: { padding: "8px" },
  editorContainer: { height: "500px" },
  resultContainer: { height: "500px" },
  submitContainer: {}
});

const editorOptions: any = {
  minimap: {
    enabled: false
  },
  lineNumbers: false
};

const App: React.FC = () => {
  const classes: any = useStyles();

  const [databaseId, setDatabaseId] = useState(null);
  const [containerId, setContainerId] = useState(null);
  const [queryText, setQueryText] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  useEffect(() => {
    console.log("app component remounted");
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
    console.log("onExecute");

    // TODO: instantiate on database id change
    const clientFactory: GremlinClientFactory = new GremlinClientFactory(
      settings.database.gremlin.hostname,
      settings.database.gremlin.port,
      settings.database.key,
      databaseId
    );

    // TODO: instantiate on container id change
    const client: GremlinClient = await clientFactory.createClient(containerId, false);

    await client.open();

    const response: { _items: any[] } = await client.execute(queryText);

    await client.close();

    const responseString: string = JSON.stringify(response._items);
    const formattedResponseString: string = prettier.format(responseString);

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
      <Grid item xs={6}>
        <div className={classes.editorContainer}>
          <QueryEditor options={editorOptions} onChange={onQueryChange} />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className={classes.resultContainer}>
          <QueryResponse options={editorOptions} value={queryResult} />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.submitContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={onExecute}
            disabled={!(databaseId && containerId && queryText)}
          >
            Execute
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default App;
