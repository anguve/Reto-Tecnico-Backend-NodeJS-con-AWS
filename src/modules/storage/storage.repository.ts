import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../../database/dynamo.client';

export class StorageRepository {
  private readonly tableName = 'StorageTable';
  /**
   * Saves a custom data object into the DynamoDB table.
   *
   * @param {object} data - The data object to save.
   * @returns {Promise<void>} A promise that resolves once the data is saved.
   */
  async saveCustomData(data: object): Promise<void> {
    const item = {
      id: uuidv4(),
      data: JSON.stringify(data),
      createdAt: Date.now(),
    };

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(item),
    });

    await dynamoClient.send(command);
  }
}
