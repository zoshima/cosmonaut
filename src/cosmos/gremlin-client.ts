import { driver } from "gremlin";

export class GremlinClientFactory {
  private clients: { [key: string]: GremlinClient };
  private key: string;
  private endpoint: string;
  private databaseName: string;

  constructor(
    protocol: string,
    hostname: string,
    port: number,
    key: string,
    databaseName: string,
    local: boolean = false
  ) {
    this.endpoint = `${protocol}://${hostname}:${port}/`;

    if (local) {
      this.endpoint += "gremlin";
    }

    this.clients = {};
    this.databaseName = databaseName;
    this.key = key;
  }

  public async createClient(containerId: string): Promise<GremlinClient> {
    if (this.clients[containerId]) {
      return this.clients[containerId];
    }

    const authenticator: driver.auth.PlainTextSaslAuthenticator = new driver.auth.PlainTextSaslAuthenticator(
      `/dbs/${this.databaseName}/colls/${containerId}`,
      this.key
    );

    const connection: GremlinClient = new GremlinClient(
      containerId,
      authenticator,
      this.endpoint
    );

    this.clients[containerId] = connection;

    return connection;
  }

  public async destroy(): Promise<void> {
    const keys: string[] = Object.keys(this.clients);

    for (const key of keys) {
      await this.clients[key].close();
    }

    this.clients = {};
  }
}

export class GremlinClient {
  private client: driver.Client;
  private _containerId: string;
  private _isOpen: boolean;

  constructor(containerId: string, authenticator: any, endpoint: string) {
    this._isOpen = false;
    this._containerId = containerId;
    this.client = new driver.Client(endpoint, {
      authenticator,
      traversalsource: "g",
      rejectUnauthorized: false,
      mimeType: "application/vnd.gremlin-v2.0+json",
    });
  }

  public get containerId(): string {
    return this._containerId;
  }

  public get isOpen(): boolean {
    return this._isOpen;
  }

  public async open(): Promise<void> {
    if (!this._isOpen) {
      console.log("opening client", this._containerId);

      await this.client.open();
      this._isOpen = true;
    }
  }

  public async close(): Promise<void> {
    if (this._isOpen) {
      console.log("closing client", this._containerId);

      await this.client.close();
      this._isOpen = false;
    }
  }

  public async execute(query: string): Promise<any> {
    const results: any = await this.client.submit(query, {});

    console.log(results);

    return results;
  }
}
