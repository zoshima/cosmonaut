import {
  CosmosClient as AzureCosmosClient,
  CosmosClientOptions,
  Database,
  SqlQuerySpec,
  RequestOptions,
  ContainerDefinition,
  FeedResponse,
} from "@azure/cosmos";
import https from "https";

export class CosmosDatabaseClient {
  private database: Database;

  constructor(
    protocol: string,
    hostname: string,
    port: number,
    key: string,
    databaseName: string
  ) {
    const endpoint: string = `${protocol}://${hostname}:${port}`;

    const clientOptions: CosmosClientOptions = {
      endpoint: endpoint,
      key: key,
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };

    const client: AzureCosmosClient = new AzureCosmosClient(clientOptions);
    this.database = client.database(databaseName);
  }

  public get id(): string {
    return this.database.id;
  }

  public async deleteContainer(containerId: string): Promise<void> {
    await this.database.container(containerId).delete();
  }

  public async getContainers(): Promise<string[]> {
    const query: SqlQuerySpec = {
      query: "select value a.id from a",
    };

    const queryResult: FeedResponse<any> = await this.database.containers
      .query(query)
      .fetchAll();

    const ids: string[] = queryResult.resources;

    return ids;
  }

  public async createContainer(
    id: string,
    partitionKey: string,
    throughput: number = 400
  ): Promise<void> {
    await this.database.containers.create(
      {
        id: id,
        partitionKey: { paths: [`/${partitionKey}`], kind: "Hash" },
      } as ContainerDefinition,
      {
        offerThroughput: throughput,
      } as RequestOptions
    );
  }

  public async getItems(
    container: string,
    label: string = null
  ): Promise<any[]> {
    const sqlQuery: string = label
      ? `select * from c where c.label = '${label}'`
      : `select * from c`;

    const query: SqlQuerySpec = {
      query: `${sqlQuery}`,
    };

    try {
      const queryResult: FeedResponse<any> = await this.database
        .container(container)
        .items.query(query)
        .fetchAll();

      return queryResult.resources;
    } catch (e) {
      console.log("error", e);
    }
  }

  public async getEdges(container: string, vertexLabel: string) {
    const sqlQuery: string = `select * from c
      where c._isEdge = true
        and (c._vertexLabel = '${vertexLabel}' or c._sinkLabel = '${vertexLabel}')`;

    const query: SqlQuerySpec = {
      query: `${sqlQuery}`,
    };

    try {
      const queryResult: FeedResponse<any> = await this.database
        .container(container)
        .items.query(query)
        .fetchAll();

      return queryResult.resources;
    } catch (e) {
      console.log("error", e);
    }
  }

  public async createItem(container: string, item: any): Promise<any> {
    await this.database.container(container).items.create(item);
  }

  public async replaceItem(
    container: string,
    partition: string,
    item: any
  ): Promise<any> {
    await this.database
      .container(container)
      .item(item.id, partition)
      .replace(item);
  }

  public async deleteItem(
    container: string,
    partition: string,
    itemId: string
  ): Promise<any> {
    await this.database
      .container(container)
      .item(itemId, partition)
      .delete();
  }
}
