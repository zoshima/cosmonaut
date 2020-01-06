import * as React from "react";
/* import { Environment, AppSettings } from "../environment"; */
import Settings from "./Settings";
import QueryEditor from "./QueryEditor";
import QueryResponse from "./QueryResponse";
import { Paper, Grid, makeStyles } from "@material-ui/core";

/* const settings: AppSettings = Environment.instance.settings; */

const useStyles: any = makeStyles({
  paper: {
    padding: "2.5px"
  }
});

const editorOptions: any = {
  minimap: false,
  lineNumbers: false
};

const App: React.FC = () => {
  const classes: any = useStyles();

  const onContainerSelected = (
    databaseId: string,
    containerId: string
  ): void => {
    console.log("connect to", databaseId, containerId);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={1}>
          <Settings onContainerSelected={onContainerSelected} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper} elevation={1}>
          <QueryEditor options={editorOptions} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper} elevation={1}>
          <QueryResponse options={editorOptions} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default App;
