import * as React from "react";
import {
  makeStyles,
  Divider,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import StorageIcon from "@material-ui/icons/Storage";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import ErrorIcon from "@material-ui/icons/Error";

import PowerIcon from "@material-ui/icons/Power";
import PowerOffIcon from "@material-ui/icons/PowerOff";

interface QueryPanelStatuBarProperties {
  profileName: string;
  isConnected: boolean;
  databaseName?: string;
  containerName?: string;
  statusMessage?: string;
  errorMessage?: string;
}

const useStyles: any = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    background: theme.palette.background.paper,
    borderTop: "1px solid",
    borderTopColor: theme.palette.divider,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    zIndex: 9999,
  },
  leftContainer: {
    display: "flex",
    flex: "33%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  middleContainer: {
    display: "flex",
    flex: "34%",
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    display: "flex",
    flex: "33%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  statusContainer: {},
  stat: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: theme.spacing(1),
  },
  connectedIcon: {
    color: theme.palette.success.main,
  },
  disconnectedIcon: {
    color: theme.palette.warning.main,
  },
}));

const QueryPanelStatusBar: React.FC<QueryPanelStatuBarProperties> = (
  properties: QueryPanelStatuBarProperties
) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <div className={classes.stat}>
          <SettingsApplicationsIcon fontSize="small" />
          <Typography variant="caption">{properties.profileName}</Typography>
        </div>
        {properties.databaseName && (
          <div className={classes.stat}>
            <StorageIcon fontSize="small" />
            <Typography variant="caption">
              {properties.databaseName}/{properties.containerName}
            </Typography>
          </div>
        )}
      </div>

      <div className={classes.middleContainer}>
        {!properties.statusMessage && properties.errorMessage && (
          <div className={classes.stat}>
            <ErrorIcon color="error" fontSize="small" />
            <Typography variant="caption">operation failed</Typography>
          </div>
        )}

        {properties.statusMessage && (
          <div className={classes.stat}>
            <Typography variant="caption">
              {properties.statusMessage}
            </Typography>
          </div>
        )}
      </div>

      <div className={classes.rightContainer}>
        {properties.isConnected ? (
          <PowerIcon className={classes.connectedIcon} fontSize="small" />
        ) : (
          <PowerOffIcon className={classes.disconnectedIcon} fontSize="small" />
        )}
      </div>
    </div>
  );
};

export default QueryPanelStatusBar;
