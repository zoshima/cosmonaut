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

    console.log(this.endpoint, this.key, this.databaseName);
  }

  public async createClient(
    containerId: string,
    openConnection: boolean = true
  ): Promise<GremlinClient> {
    if (this.clients[containerId]) {
      return this.clients[containerId];
    }

    const authenticator: driver.auth.PlainTextSaslAuthenticator = new driver.auth.PlainTextSaslAuthenticator(
      `/dbs/${this.databaseName}/colls/${containerId}`,
      this.key
    );

    console.log(containerId, authenticator, this.endpoint);

    const connection: GremlinClient = new GremlinClient(
      containerId,
      authenticator,
      this.endpoint
    );

    if (openConnection) {
      await connection.open();
    }

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

  constructor(containerId: string, authenticator: any, endpoint: string) {
    this._containerId = containerId;
    this.client = new driver.Client(endpoint, {
      authenticator,
      traversalsource: "g",
      rejectUnauthorized: false,
      mimeType: "application/vnd.gremlin-v2.0+json"
    });
  }

  public get containerId(): string {
    return this._containerId;
  }

  public async open(): Promise<void> {
    await this.client.open();
  }

  public async close(): Promise<void> {
    await this.client.close();
  }

  public async execute(query: string): Promise<any> {
    const results: any = await this.client.submit(query, {});

    return results;
  }
}
