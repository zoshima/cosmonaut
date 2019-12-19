import { driver } from "gremlin";

export class GremlinClientFactory {
  private clients: { [key: string]: GremlinClient };
  private key: string;
  private endpoint: string;
  private databaseName: string;

  constructor(endpoint: string, key: string, databaseName: string) {
    this.clients = {};
    this.endpoint = endpoint;
    this.databaseName = databaseName;
    this.key = key;
  }

  public async createClient(
    collectionId: string,
    openConnection: boolean = true
  ): Promise<GremlinClient> {
    if (this.clients[collectionId]) {
      return this.clients[collectionId];
    }

    const authenticator: driver.auth.PlainTextSaslAuthenticator = new driver.auth.PlainTextSaslAuthenticator(
      `/dbs/${this.databaseName}/colls/${collectionId}`,
      this.key
    );

    const connection: GremlinClient = new GremlinClient(
      authenticator,
      this.endpoint
    );

    if (openConnection) {
      await connection.open();
    }

    this.clients[collectionId] = connection;

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

  constructor(authenticator: any, endpoint: string) {
    this.client = new driver.Client(endpoint, {
      authenticator,
      traversalsource: "g",
      rejectUnauthorized: true,
      mimeType: "application/vnd.gremlin-v2.0+json"
    });
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
