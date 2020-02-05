import React, { useEffect, useState } from "react";
import {
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";

interface SettingsProps {
  databaseIds: string[];
  containerIds: string[];
  onDatabaseSelected: (databaseId: string) => void;
  onContainerSelected: (databaseId: string) => void;
}

const useStyles: any = makeStyles({
  form: {},
  formControl: {
    width: "200px",
    marginRight: "10px"
  }
});

const Settings: React.FC<SettingsProps> = ({
  databaseIds,
  containerIds,
  onDatabaseSelected,
  onContainerSelected
}) => {
  const classes: any = useStyles();

  const [databaseId, setDatabaseId] = useState("");
  const [containerId, setContainerId] = useState("");

  const onDatabaseIdChanged = async (
    event: React.ChangeEvent<{ value: string }>
  ): Promise<void> => {
    const selectedDatabaseId: string = event.target.value;

    if (databaseId !== selectedDatabaseId) {
      onDatabaseSelected(selectedDatabaseId);
      setDatabaseId(selectedDatabaseId);
    }
  };

  const onContainerIdChanged = async (
    event: React.ChangeEvent<{ value: string }>
  ): Promise<void> => {
    const selectedContainerId: string = event.target.value;

    if (containerId !== selectedContainerId) {
      onContainerSelected(selectedContainerId);
      setContainerId(selectedContainerId);
    }
  };

  return (
    <form autoComplete="off" className={classes.form}>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel id="database-input-label">Database</InputLabel>
        <Select
          labelId="database-input-label"
          id="database-select"
          value={databaseId}
          onChange={onDatabaseIdChanged}
          disabled={!databaseIds.length}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {databaseIds.map((database: string) => {
            return (
              <MenuItem key={database} value={database}>
                {database}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel id="container-input-label">Container</InputLabel>
        <Select
          labelId="container-input-label"
          id="container-select"
          value={containerId}
          onChange={onContainerIdChanged}
          disabled={!containerIds.length}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
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
