import * as React from "react";
import { Database } from "@azure/cosmos";
import DatabaseSelect from "./DatabaseSelect";
import { useState } from "react";

const databases: Database[] = [
  {
    id: "cosdb-kdi-01"
  } as Database,
  {
    id: "cosdb-kdi-02"
  } as Database
];

const App: React.FC = () => {
  const [database, setDatabase] = useState();

  const selectDatabase = (selectedDatabase: Database): void => {
    if (selectedDatabase.id === database?.id) {
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
