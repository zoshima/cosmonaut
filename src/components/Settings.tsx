import React, {useState} from "react";
import {
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Toolbar,
  createStyles,
  Theme
} from "@material-ui/core";

interface SettingsInput {
  databaseIds: string[];
  containerIds: string[];
  onDatabaseSelected: (databaseId: string) => void;
  onContainerSelected: (databaseId: string) => void;
}

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: "200px",
      marginRight: theme.spacing(1)
    }
  })
);

const Settings: React.FC<SettingsInput> = (input: SettingsInput) => {
  const classes: any = useStyles();

  const [databaseId, setDatabaseId] = useState("");
  const [containerId, setContainerId] = useState("");

  const onDatabaseIdChanged = async (
    event: React.ChangeEvent<{value: string}>
  ): Promise<void> => {
    const selectedDatabaseId: string = event.target.value;

    if (databaseId !== selectedDatabaseId) {
      input.onDatabaseSelected(selectedDatabaseId);
      setDatabaseId(selectedDatabaseId);
    }
  };

  const onContainerIdChanged = async (
    event: React.ChangeEvent<{value: string}>
  ): Promise<void> => {
    const selectedContainerId: string = event.target.value;

    if (containerId !== selectedContainerId) {
      input.onContainerSelected(selectedContainerId);
      setContainerId(selectedContainerId);
    }
  };

  return (
    <Toolbar id="tool-bar" className={classes.toolbar}>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel id="database-input-label">Database</InputLabel>
        <Select
          labelId="database-input-label"
          id="database-select"
          value={databaseId}
          onChange={onDatabaseIdChanged}
          disabled={!(input.databaseIds && input.databaseIds.length)}
        >
          {input.databaseIds.map((database: string) => {
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
          disabled={!(input.containerIds && input.containerIds.length)}
        >
          {input.containerIds.map((container: string) => {
            return (
              <MenuItem key={container} value={container}>
                {container}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Toolbar>
  );
};

export default Settings;
