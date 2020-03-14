import {
  makeStyles,
  TextField,
  FormGroup,
  FormControl,
  Select,
  InputLabel,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {Configuration} from "../models/configuration.model";
import {Environment} from "../environment";

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
  const params: {id?: string} = useParams();
  const classes: any = useStyles();
  const id: string = params.id || Date.now() + "";

  const configuration: Configuration =
    Environment.instance.configurations.find(
      (c: Configuration) => c.id === id
    ) || (
      {
        id: id,
        cosmos: {
          protocol: "http"
        },
        gremlin: {
          protocol: "ws"
        }
      } as Configuration);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const onChange = async (event: React.ChangeEvent<{id: string, value: string | number}>): Promise<void> => {
    const _errors: {[key: string]: string} = {...errors};

    if (!event.target.value) {
      _errors[event.target.id] = "required";
    } else {
      delete _errors[event.target.id];
    }

    setErrors(_errors);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (Object.keys(errors).length) {
      console.error(errors);
      return;
    }

    const elements: HTMLFormControlsCollection = (event.target as HTMLFormElement).elements;

    const _errors: {[key: string]: string} = {};

    for (const element of elements) {
      const _element: HTMLInputElement | HTMLSelectElement = element as HTMLInputElement | HTMLSelectElement;

      if (_element.id && !_element.value) {
        _errors[element.id] = "required";
      }
    }

    if (Object.keys(_errors).length) {
      console.error(_errors);
      setErrors(_errors);
      return;
    }

    const _configuration: Configuration = {
      id: configuration.id,
      title: (elements.namedItem("title") as HTMLInputElement).value,
      description: (elements.namedItem("description") as HTMLInputElement).value,
      key: (elements.namedItem("key") as HTMLInputElement).value,
      cosmos: {
        hostname: (elements.namedItem("cosmos-hostname") as HTMLInputElement).value,
        port: Number((elements.namedItem("cosmos-port") as HTMLInputElement).value),
        protocol: (elements.namedItem("cosmos-protocol") as HTMLSelectElement).value
      },
      gremlin: {
        hostname: (elements.namedItem("gremlin-hostname") as HTMLInputElement).value,
        port: Number((elements.namedItem("gremlin-port") as HTMLInputElement).value),
        protocol: (elements.namedItem("gremlin-protocol") as HTMLSelectElement).value
      }
    } as Configuration;

    if (_configuration.cosmos.hostname.indexOf("azure.com") !== -1) {
      _configuration.img = "./assets/img/azure_logo.svg";
    } else {
      _configuration.img = "./assets/img/cosmosdb_logo.svg";
    }

    Environment.instance.setConfiguration(_configuration);

    window.location.href = "#/";
  };

  useEffect(() => {
    console.log("useEffect", "ConfigurationForm");
  }, []);

  return (
    <div className={classes.container}>
      <form className={classes.form} noValidate autoComplete="off" onSubmit={onSubmit}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <FormGroup className={classes.formGroup}>
              <TextField
                required
                id="title"
                label="Title"
                onChange={onChange}
                error={!!errors["title"]}
                defaultValue={configuration.title}
              />
              <TextField
                required
                id="description"
                label="Description"
                onChange={onChange}
                error={!!errors["description"]}
                defaultValue={configuration.description}
              />
              <TextField
                required
                id="key"
                label="Key"
                onChange={onChange}
                error={!!errors["key"]}
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
                  native
                  id="cosmos-protocol"
                  defaultValue={configuration.cosmos.protocol}
                >
                  <option value="http">http</option>
                  <option value="https">https</option>
                </Select>
              </FormControl>

              <TextField
                required
                id="cosmos-hostname"
                label="Hostname"
                onChange={onChange}
                error={!!errors["cosmos-hostname"]}
                defaultValue={configuration.cosmos.hostname}
              />
              <TextField
                required
                id="cosmos-port"
                label="Port"
                type="number"
                onChange={onChange}
                error={!!errors["cosmos-port"]}
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
                  native
                  id="gremlin-protocol"
                  defaultValue={configuration.gremlin.protocol}
                >
                  <option value="ws">ws</option>
                  <option value="wss">wss</option>
                </Select>
              </FormControl>

              <TextField
                required
                id="gremlin-hostname"
                label="Hostname"
                onChange={onChange}
                error={!!errors["gremlin-hostname"]}
                defaultValue={configuration.gremlin.hostname}
              />
              <TextField
                required
                id="gremlin-port"
                label="Port"
                type="number"
                onChange={onChange}
                error={!!errors["gremlin-port"]}
                defaultValue={configuration.gremlin.port}
              />
            </FormGroup>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button href="#/">Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={!!Object.keys(errors).length}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
};

export default ConfigurationForm;
