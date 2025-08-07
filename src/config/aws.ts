import { LambdaClient } from '@aws-sdk/client-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { envs } from './env';

export const awsConfig = {
  region: 'us-east-2',
  credentials: {
    accessKeyId: envs.AWS_ACCESS_KEY_ID,
    secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
  },
};

export const lambdaClient = new LambdaClient(awsConfig);

export const dynamoClient = new DynamoDBClient(awsConfig);
export const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

export const LAMBDA_FUNCTION_ARN =
  'arn:aws:lambda:us-east-2:246728194117:function:getMergedDataFunction';
export const LAMBDA_FUNCTION_NAME = 'getMergedDataFunction';
