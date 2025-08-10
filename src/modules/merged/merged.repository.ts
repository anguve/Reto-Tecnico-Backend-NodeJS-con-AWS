import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../../database/dynamo.client';

export class MergedRepository {
  private readonly tableName = 'FusionadosTable';

  /**
   * Saves merged data to DynamoDB table.
   *
   * @param {Object} data - Data to save.
   * @param {number} data.totalCharacters - Total number of characters.
   * @param {Array<unknown>} data.characters - List of character data objects.
   *
   * @returns {Promise<void>} Promise that resolves when the data is saved.
   */
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
}
