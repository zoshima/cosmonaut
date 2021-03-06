import {
  CosmosClient as AzureCosmosClient,
  CosmosClientOptions,
  DatabaseDefinition,
  FeedResponse,
  Resource,
} from "@azure/cosmos";
import https from "https";

export class CosmosClient {
  private client: AzureCosmosClient;
  private _endpoint: string;
  private _hostname: string;
  private _key: string;
  private _port: number;

  constructor(protocol: string, hostname: string, port: number, key: string) {
    this._endpoint = `${protocol}://${hostname}:${port}/`;
    this._key = key;
    this._hostname = hostname;
    this._port = port;

    const clientOptions: CosmosClientOptions = {
      endpoint: this._endpoint,
      key: key,
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    this.client = new AzureCosmosClient(clientOptions);
  }

  public get endpoint(): string {
    return this._endpoint;
  }

  public get hostname(): string {
    return this._hostname;
  }

  public get port(): number {
    return this._port;
  }

  public get key(): string {
    return this._key;
  }

  public async getDatabases(): Promise<string[]> {
    const databaseList: FeedResponse<DatabaseDefinition &
      Resource> = await this.client.databases.readAll().fetchAll();

    const dbs: (DatabaseDefinition & Resource)[] = databaseList.resources.map(
      (result: DatabaseDefinition & Resource) => result
    );

    const sortedDbs = dbs.sort((a, b) => (a._ts > b._ts ? 1 : 1));

    const ids: string[] = sortedDbs.map(
      (result: DatabaseDefinition & Resource) => result.id
    );

    return ids;
  }

  public async createDatabase(id: string): Promise<void> {
    await this.client.databases.createIfNotExists({
      id: id,
    });
  }

  public async deleteDatabase(id: string): Promise<void> {
    await this.client.database(id).delete();
  }
}
