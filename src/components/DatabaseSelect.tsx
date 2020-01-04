import React from "react";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  makeStyles
} from "@material-ui/core";

interface DatabaseSelectProps {
  databases: string[];
  selectDatabase: (selectedDatabase: string) => void;
}

const useStyles: any = makeStyles({
  formControl: {
    width: "100%"
  }
});

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({
  databases,
  selectDatabase
}) => {
  const classes: any = useStyles();
  const onChange = (event: React.ChangeEvent<{ value: number }>): void => {
    const index: number = Number(event.target.value);

    selectDatabase(databases[index]);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="database-input-label">Database</InputLabel>
      <Select
        labelId="database-input-label"
        id="database-select"
        onChange={onChange}
        value=""
      >
        {databases.map((database: string, index: number) => {
          return (
            <MenuItem key={database} value={index}>
              {database}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DatabaseSelect;
