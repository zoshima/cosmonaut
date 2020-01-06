import React, { useEffect, useState } from "react";
import { CosmosClient } from "../cosmos/cosmos-client";
import {
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import { CosmosDatabaseClient } from "../cosmos/cosmos-database-client";
import { AppSettings, Environment } from "../environment";

interface SettingsProps {
  onContainerSelected: (databaseId: string, containerId: string) => void;
}

const useStyles: any = makeStyles({
  form: {
    width: "100%"
  },
  formControl: {
    width: "100%"
  }
});

const Settings: React.FC<SettingsProps> = ({ onContainerSelected }) => {
  const classes: any = useStyles();
  const settings: AppSettings = Environment.instance.settings;

  const [databaseIds, setDatabaseIds] = useState([]);
  const [containerIds, setContainerIds] = useState([]);
  const [databaseId, setDatabaseId] = useState("");
  const [containerId, setContainerId] = useState("");

  useEffect(() => {
    const cosmosClient: CosmosClient = new CosmosClient(
      settings.database.hostname,
      settings.database.port,
      settings.database.key
    );

    cosmosClient.getDatabases().then((databaseIds: string[]) => {
      setDatabaseIds(databaseIds);
    });
  }, []);

  const selectDatabase = async (
    event: React.ChangeEvent<{ value: string }>
  ): Promise<void> => {
    const selectedDatabaseId: string = event.target.value;

    if (databaseId === selectedDatabaseId) {
      return;
    }

    const databaseClient: CosmosDatabaseClient = new CosmosDatabaseClient(
      settings.database.hostname,
      settings.database.port,
      settings.database.key,
      selectedDatabaseId
    );

    const containerIds: string[] = await databaseClient.getContainers();

    setDatabaseId(selectedDatabaseId);
    setContainerIds(containerIds);
  };

  const selectContainer = async (
    event: React.ChangeEvent<{ value: string }>
  ): Promise<void> => {
    const selectedContainerId: string = event.target.value;

    if (containerId === selectedContainerId) {
      return;
    }

    setContainerId(selectedContainerId);
    onContainerSelected(databaseId, selectedContainerId);
  };

  return (
    <form autoComplete="off" className={classes.form}>
      <FormControl className={classes.formControl}>
        <InputLabel id="database-input-label">Database</InputLabel>
        <Select
          labelId="database-input-label"
          id="database-select"
          value={databaseId}
          onChange={selectDatabase}
          disabled={!databaseIds.length}
        >
          {databaseIds.map((database: string) => {
            return (
              <MenuItem key={database} value={database}>
                {database}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel id="container-input-label">Container</InputLabel>
        <Select
          labelId="container-input-label"
          id="container-select"
          value={containerId}
          onChange={selectContainer}
          disabled={!containerIds.length}
        >
          {containerIds.map((container: string) => {
            return (
              <MenuItem key={container} value={container}>
                {container}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </form>
  );
};

export default Settings;
