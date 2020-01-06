import {
  CosmosClient as AzureCosmosClient,
  CosmosClientOptions,
  DatabaseDefinition,
  Resource,
  FeedResponse
} from "@azure/cosmos";

export class CosmosClient {
  private client: AzureCosmosClient;
  private _endpoint: string;
  private _hostname: string;
  private _key: string;
  private _port: number;

  constructor(hostname: string, port: number, key: string) {
    this._endpoint = `http://${hostname}:${port}/`;
    this._key = key;
    this._hostname = hostname;
    this._port = port;

    const clientOptions: CosmosClientOptions = {
      endpoint: this._endpoint,
      key: key
    };

    console.log(this._endpoint, this._key);

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

    const ids: string[] = databaseList.resources.map(
      (result: DatabaseDefinition & Resource) => result.id
    );

    return ids;
  }

  public async createDatabase(id: string): Promise<void> {
    await this.client.databases.createIfNotExists({
      id: id
    });
  }

  public async deleteDatabase(id: string): Promise<void> {
    await this.client.database(id).delete();
  }
}
