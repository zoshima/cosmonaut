import React, { useState } from "react";
import {
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Toolbar,
  Theme,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

interface QueryPanelSettingsProperties {
  databaseIds: string[];
  containerIds: string[];
  onDatabaseSelected: (databaseId: string) => void;
  onContainerSelected: (containerId: string) => void;
  onExecutionProfileToggled: (isChecked: boolean) => void;
}

const useStyles: any = makeStyles((theme: Theme) => ({
  formControl: {
    width: "200px",
    marginRight: theme.spacing(1),
  },
}));

const QueryPanelSettings: React.FC<QueryPanelSettingsProperties> = (
  properties: QueryPanelSettingsProperties
) => {
  const classes: any = useStyles();

  const [containerId, setContainerId] = useState("");
  const [databaseId, setDatabaseId] = useState("");

  const onContainerIdChanged = async (
    event: React.ChangeEvent<{ value: string }>
  ): Promise<void> => {
    const selectedContainerId: string = event.target.value;

    if (containerId !== selectedContainerId) {
      properties.onContainerSelected(selectedContainerId);
      setContainerId(selectedContainerId);
    }
  };

  const onDatabaseIdChanged = async (
    event: React.ChangeEvent<{ value: string }>
  ): Promise<void> => {
    const selecteddatabaseId: string = event.target.value;

    if (databaseId !== selecteddatabaseId) {
      properties.onDatabaseSelected(selecteddatabaseId);
      setDatabaseId(selecteddatabaseId);
    }
  };

  const onExecutionProfileToggled = async (
    _event: never,
    isChecked: boolean
  ): Promise<void> => {
    properties.onExecutionProfileToggled(isChecked);
  };

  return (
    <Toolbar id="tool-bar" className={classes.toolbar}>
      <FormControl
        className={classes.formControl}
        variant="filled"
        size="small"
      >
        <InputLabel id="database-input-label">Database</InputLabel>
        <Select
          labelId="database-input-label"
          id="database-select"
          value={databaseId}
          onChange={onDatabaseIdChanged}
          disabled={!(properties.databaseIds && properties.databaseIds.length)}
        >
          {properties.databaseIds.map((database: string) => {
            return (
              <MenuItem key={database} value={database}>
                {database}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl
        className={classes.formControl}
        variant="filled"
        size="small"
      >
        <InputLabel id="container-input-label">Container</InputLabel>
        <Select
          labelId="container-input-label"
          id="container-select"
          value={containerId}
          onChange={onContainerIdChanged}
          disabled={
            !(properties.containerIds && properties.containerIds.length)
          }
        >
          {properties.containerIds.map((container: string) => {
            return (
              <MenuItem key={container} value={container}>
                {container}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch color="primary" onChange={onExecutionProfileToggled} />
        }
        label="Execution profile"
      />
    </Toolbar>
  );
};

export default QueryPanelSettings;
