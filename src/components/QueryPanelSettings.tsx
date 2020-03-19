import React, {useState} from "react";
import {
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Toolbar,
  Theme
} from "@material-ui/core";

interface QueryPanelSettingsProperties {
  databaseIds: string[];
  containerIds: string[];
  onDatabaseSelected: (databaseId: string) => void;
  onContainerSelected: (databaseId: string) => void;
}

const useStyles: any = makeStyles((theme: Theme) =>
  ({
    formControl: {
      width: "200px",
      marginRight: theme.spacing(1)
    }
  })
);

const QueryPanelSettings: React.FC<QueryPanelSettingsProperties> = (properties: QueryPanelSettingsProperties) => {
  const classes: any = useStyles();

  const [databaseId, setDatabaseId] = useState("");
  const [containerId, setContainerId] = useState("");

  const onDatabaseIdChanged = async (
    event: React.ChangeEvent<{value: string}>
  ): Promise<void> => {
    const selectedDatabaseId: string = event.target.value;

    if (databaseId !== selectedDatabaseId) {
      properties.onDatabaseSelected(selectedDatabaseId);
      setDatabaseId(selectedDatabaseId);
    }
  };

  const onContainerIdChanged = async (
    event: React.ChangeEvent<{value: string}>
  ): Promise<void> => {
    const selectedContainerId: string = event.target.value;

    if (containerId !== selectedContainerId) {
      properties.onContainerSelected(selectedContainerId);
      setContainerId(selectedContainerId);
    }
  };

  return (
    <Toolbar id="tool-bar" className={classes.toolbar}>
      <FormControl className={classes.formControl} variant="filled">
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

      <FormControl className={classes.formControl} variant="filled">
        <InputLabel id="container-input-label">Container</InputLabel>
        <Select
          labelId="container-input-label"
          id="container-select"
          value={containerId}
          onChange={onContainerIdChanged}
          disabled={!(properties.containerIds && properties.containerIds.length)}
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
    </Toolbar>
  );
};

export default QueryPanelSettings;
