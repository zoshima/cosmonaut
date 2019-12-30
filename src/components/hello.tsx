import React from "react";
import { Button } from "@material-ui/core";

export class Hello extends React.Component<{ name: string }, {}> {
  render() {
    return <Button variant="contained" color="primary">
      Hello {this.props.name}
    </Button>;
  }
}
