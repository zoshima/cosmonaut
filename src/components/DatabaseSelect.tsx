import React from "react";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import { Database } from "@azure/cosmos";

interface DatabaseSelectProps {
  databases: Database[];
  selectDatabase: (selectedDatabase: Database) => void;
}

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({
  databases,
  selectDatabase
}) => {
  const onChange = (event: React.ChangeEvent<{ value: number }>): void => {
    const index: number = Number(event.target.value);

    selectDatabase(databases[index]);
  };

  return (
    <FormControl>
      <InputLabel id="database-input-label">Database</InputLabel>
      <Select
        labelId="database-input-label"
        id="database-select"
        onChange={onChange}
        value=""
      >
        {databases.map((database: Database, index: number) => {
          return (
            <MenuItem key={database.id} value={index}>
              {database.id}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DatabaseSelect;
