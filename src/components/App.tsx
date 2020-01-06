import * as React from "react";
/* import { Environment, AppSettings } from "../environment"; */
import Settings from "./Settings";

/* const settings: AppSettings = Environment.instance.settings; */

const App: React.FC = () => {
  const onContainerSelected = (
    databaseId: string,
    containerId: string
  ): void => {
    console.log("connect to", databaseId, containerId);
  };

  return (
    <React.Fragment>
      <Settings onContainerSelected={onContainerSelected} />
    </React.Fragment>
  );
};

export default App;
