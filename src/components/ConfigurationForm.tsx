import {
  makeStyles,
  Dialog,
  AppBar,
  TextField,
  Checkbox,
  FormControlLabel,
  Switch,
  FormGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Divider
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Configuration } from "../models/configuration.model";
import { Environment } from "../environment";

const useStyles: any = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "50px"
  },
  card: {
    width: "500px"
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  formSectionTitle: {
    marginTop: "30px",
    marginBottom: "15px",
    fontSize: "1.2em"
  },
  cardContent: {},
  form: {},
  formGroup: {
    paddingLeft: "15px"
  }
});

const ConfigurationForm: React.FC = () => {
  const { id } = useParams();
  const classes: any = useStyles();

  const _configuration: Configuration =
    Environment.instance.configurations.find(
      (c: Configuration) => c.id === id
    ) || {};

  const [configuration, setConfiguration] = useState<Configuration>(
    _configuration
  );

  useEffect(() => {
    console.log("useEffect", "ConfigurationForm");
  }, []);

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <form className={classes.form} noValidate autoComplete="off">
            <FormGroup className={classes.formGroup}>
              <TextField
                required
                id="title"
                label="Title"
                defaultValue={configuration.title}
              />
              <TextField
                required
                id="description"
                label="Description"
                defaultValue={configuration.description}
              />
              <TextField
                required
                id="key"
                label="Key"
                defaultValue={configuration.key}
              />
            </FormGroup>

            <Typography
              className={classes.formSectionTitle}
              color="textPrimary"
              gutterBottom
            >
              Cosmos
            </Typography>

            <FormGroup className={classes.formGroup}>
              <FormControl>
                <InputLabel>Protocol</InputLabel>
                <Select
                  value="http"
                  id="cosmos-protocol"
                  defaultValue={configuration.cosmos.protocol}
                >
                  <MenuItem value="http">http</MenuItem>
                  <MenuItem value="https">https</MenuItem>
                </Select>
              </FormControl>

              <TextField
                required
                id="cosmos-hostname"
                label="Hostname"
                defaultValue={configuration.cosmos.hostname}
              />
              <TextField
                required
                id="cosmos-port"
                label="Port"
                type="number"
                defaultValue={configuration.cosmos.port}
              />
            </FormGroup>

            <Typography
              className={classes.formSectionTitle}
              color="textPrimary"
              gutterBottom
            >
              Gremlin
            </Typography>

            <FormGroup className={classes.formGroup}>
              <FormControl>
                <InputLabel>Protocol</InputLabel>
                <Select
                  value="ws"
                  id="gremlin-protocol"
                  defaultValue={configuration.gremlin.protocol}
                >
                  <MenuItem value="ws">ws</MenuItem>
                  <MenuItem value="wss">wss</MenuItem>
                </Select>
              </FormControl>

              <TextField
                required
                id="gremlin-hostname"
                label="Hostname"
                defaultValue={configuration.gremlin.hostname}
              />
              <TextField
                required
                id="gremlin-port"
                label="Port"
                type="number"
                defaultValue={configuration.gremlin.port}
              />
            </FormGroup>
          </form>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button href="#/">Cancel</Button>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ConfigurationForm;
