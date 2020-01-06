import * as React from "react";
import { CosmosClient } from "../cosmos/cosmos-client";
import { Environment, AppSettings } from "../environment";
import Settings from "./Settings";

const settings: AppSettings = Environment.instance.settings;
const cosmosClient: CosmosClient = new CosmosClient(
  settings.database.hostname,
  settings.database.port,
  settings.database.key
);

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Settings cosmosClient={cosmosClient} />
    </React.Fragment>
  );
};

export default App;
