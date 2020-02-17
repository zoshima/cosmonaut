export interface Configuration {
  title: string;
  description: string;
  img: string;

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
