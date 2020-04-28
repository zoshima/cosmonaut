import {
  makeStyles,
  TextField,
  FormGroup,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Button,
  Theme,
  Divider,
} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import {Configuration} from "src/models";
import {Environment} from "src/environment";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles: any = makeStyles((theme: Theme) => ({
  form: {
    width: "500px",
    '& .MuiFormControl-root': {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(2)
    },
    '& .MuiFormGroup-root': {
      marginTop: theme.spacing(1),
    },
  },
})
);

interface ConfigurationFormProperties {
  id?: string;
  isOpen: boolean;
  onClose: any; //function
}

const ConfigurationForm: React.FC<ConfigurationFormProperties> = (properties: ConfigurationFormProperties) => {
  const classes: any = useStyles();
  const id: string = properties.id || Date.now() + "";

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

  const onClose = (): void => {
    setErrors({});

    properties.onClose();
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>): void => {
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

    properties.onClose(true);
  };

  useEffect(() => {
    console.log("useEffect", "ConfigurationForm");
  }, []);

  return (
    <Dialog open={properties.isOpen} onClose={onClose}>
      <DialogTitle>
        {!!properties.id
          ? <span>Edit configuration</span>
          : <span>New configuration</span>
        }
      </DialogTitle>

      <DialogContent>
        <form className={classes.form} noValidate autoComplete="off" onSubmit={submitForm} id="form">
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

          <FormGroup className={classes.formGroup}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Cosmos
            </Typography>

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


          <FormGroup className={classes.formGroup}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Gremlin
            </Typography>

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
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="form" variant="contained" color="primary" disabled={!!Object.keys(errors).length}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurationForm;
