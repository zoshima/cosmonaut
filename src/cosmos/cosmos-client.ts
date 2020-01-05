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
  private _key: string;

  constructor(endpoint: string, key: string) {
    this._endpoint = endpoint;
    this._key = key;

    const clientOptions: CosmosClientOptions = {
      endpoint: endpoint,
      key: key
    };

    this.client = new AzureCosmosClient(clientOptions);
  }

  public get endpoint(): string {
    return this._endpoint;
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
