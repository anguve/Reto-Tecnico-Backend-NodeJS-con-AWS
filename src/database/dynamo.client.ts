import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { envs } from '../config/env';
/**
 * DynamoDB client configured with the region specified in environment variables.
 *
 * @type {DynamoDBClient}
 */
export const dynamoClient = new DynamoDBClient({
  region: envs.AWS_REGION,
});
