import React, { useState } from "react";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  makeStyles
} from "@material-ui/core";

interface ContainerSelectProps {
  containers: string[];
  selectContainer: (selectedContainer: string) => void;
}

const useStyles: any = makeStyles({
  formControl: {
    width: "100%"
  }
});

const ContainerSelect: React.FC<ContainerSelectProps> = ({
  containers,
  selectContainer
}) => {
  const classes: any = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onChange = (event: React.ChangeEvent<{ value: number }>): void => {
    const index: number = Number(event.target.value);

    selectContainer(containers[index]);
    setSelectedIndex(index);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="container-input-label">Container</InputLabel>
      <Select
        labelId="container-input-label"
        id="container-select"
        onChange={onChange}
        value={selectedIndex}
        disabled={!containers.length}
      >
        {containers.map((container: string, index: number) => {
          return (
            <MenuItem key={container} value={index}>
              {container}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default ContainerSelect;
