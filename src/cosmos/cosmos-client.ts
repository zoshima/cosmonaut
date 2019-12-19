import {
  CosmosClient as AzureCosmosClient,
  CosmosClientOptions,
  DatabaseDefinition,
  Resource,
  FeedResponse
} from "@azure/cosmos";

export class CosmosClient {
  private client: AzureCosmosClient;

  constructor(endpoint: string, key: string) {
    const clientOptions: CosmosClientOptions = {
      endpoint: endpoint,
      key: key
    };

    this.client = new AzureCosmosClient(clientOptions);
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
