import * as React from "react";
import DatabaseSelect from "./DatabaseSelect";
import { useState, useEffect } from "react";
import { CosmosClient } from "../cosmos/cosmos-client";
import { Environment, Settings } from "../environment";

const settings: Settings = Environment.instance.settings;
const cosmosClient: CosmosClient = new CosmosClient(
  settings.database.endpoint,
  settings.database.key
);

const App: React.FC = () => {
  const [database, setDatabase] = useState(null);
  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    cosmosClient.getDatabases().then((databases: string[]) => {
      setDatabases(databases);
    });
  });

  const selectDatabase = (selectedDatabase: string): void => {
    if (selectedDatabase === database?.id) {
      return;
    }

    console.log("reconnect", database, selectedDatabase);

    setDatabase(selectedDatabase);
  };

  return (
    <React.Fragment>
      <DatabaseSelect databases={databases} selectDatabase={selectDatabase} />
    </React.Fragment>
  );
};

export default App;
