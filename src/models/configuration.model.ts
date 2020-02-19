export interface Configuration {
  id: string;
  title: string;
  description: string;
  img: any;

  key: string;

  cosmos: {
    hostname: string;
    protocol: "https" | "http";
    port: number;
  };

  gremlin: {
    hostname: string;
    protocol: "wss" | "ws";
    port: number;
  };
}
