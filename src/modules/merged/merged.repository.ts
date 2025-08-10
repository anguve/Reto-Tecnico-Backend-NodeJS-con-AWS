import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../../database/dynamo.client';

export class MergedRepository {
  private readonly tableName = 'FusionadosTable';

  async saveMergedData(data: { totalCharacters: number; characters: unknown[] }): Promise<void> {
    const item = {
      id: uuidv4(),
      historyPartition: 'history',
      totalCharacters: data.totalCharacters,
      characters: JSON.stringify(data.characters),
      timestamp: Date.now(),
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(item),
    });

    await dynamoClient.send(command);
  }

  /**
   * Busca datos cacheados de los últimos 30 minutos.
   */
  async getCachedData(): Promise<{ totalCharacters: number; characters: unknown[] } | null> {
    const CACHE_TTL_MINUTES = 1;
    const thirtyMinutesAgo = Date.now() - CACHE_TTL_MINUTES * 60 * 1000;

    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'HistoryIndexV2',
      KeyConditionExpression: 'historyPartition = :hp AND #ts >= :minTs',
      ExpressionAttributeNames: { '#ts': 'timestamp' },
      ExpressionAttributeValues: marshall({
        ':hp': 'history',
        ':minTs': thirtyMinutesAgo,
      }),
      ScanIndexForward: false,
      Limit: 1,
    });

    const { Items } = await dynamoClient.send(command);

    if (!Items || Items.length === 0) return null;

    const record = unmarshall(Items[0]);
    return {
      totalCharacters: record.totalCharacters,
      characters: JSON.parse(record.characters),
    };
  }
}
