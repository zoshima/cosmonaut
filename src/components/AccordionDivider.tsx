import * as React from "react";

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import {makeStyles} from "@material-ui/core";

interface AccordionDividerProperties {
  direction: "up" | "down";
  onClick: any;
}

const useStyles: any = makeStyles(theme => ({
  dividerContainer: {
    display: "flex",
    justifyContent: "center",
    background: theme.palette.background.paper,
    cursor: "pointer"
  }
}));

const AccordionDivider: React.FC<AccordionDividerProperties> = (properties: AccordionDividerProperties) => {
  const classes = useStyles();

  return (
    <div className={classes.dividerContainer} onClick={properties.onClick}>
      {properties.direction === "up"
        ? <ArrowDropUpIcon />
        : <ArrowDropDownIcon />
      }
    </div>
  );
};

export default AccordionDivider;
