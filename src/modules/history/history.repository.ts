import { dynamoClient } from '../../database/dynamo.client';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export class HistoryRepository {
  private readonly tableName = 'FusionadosTable';

  async getHistory(limit: number, lastKey?: any, ascending: boolean = true) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'HistoryIndexV2',
      KeyConditionExpression: 'historyPartition = :historyPartition',
      ExpressionAttributeValues: {
        ':historyPartition': { S: 'history' },
      },
      Limit: limit,
      ScanIndexForward: ascending,
      ExclusiveStartKey: lastKey,
    });

    const response = await dynamoClient.send(command);

    return {
      items: response.Items?.map((item) => unmarshall(item)) ?? [],
      lastEvaluatedKey: response.LastEvaluatedKey ?? null,
    };
  }
}
