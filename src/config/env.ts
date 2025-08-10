import 'dotenv/config';
import { number, object, string } from 'yup';

const environmentVariablesSchema = object({
  AWS_ACCESS_KEY_ID: string()
    .required('AWS_ACCESS_KEY_ID is required')
    .min(16, 'AWS_ACCESS_KEY_ID must be at least 16 characters')
    .matches(/^[A-Z0-9]+$/, 'AWS_ACCESS_KEY_ID must be uppercase alphanumeric'),

  AWS_SECRET_ACCESS_KEY: string()
    .required('AWS_SECRET_ACCESS_KEY is required')
    .min(40, 'AWS_SECRET_ACCESS_KEY must be at least 40 characters'),

  AWS_REGION: string()
    .required('AWS_REGION is required')
    .oneOf(
      ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'],
      'AWS_REGION must be one of: us-east-1, us-east-2, us-west-1, us-west-2',
    ),

  AWS_ACCOUNT_ID: string()
    .required('AWS_ACCOUNT_ID is required')
    .length(12, 'AWS_ACCOUNT_ID must be exactly 12 digits')
    .matches(/^\d+$/, 'AWS_ACCOUNT_ID must be numeric'),

  LAMBDA_MERGE_FUNCTION_ARN: string()
    .required('LAMBDA_FUNCTION_ARN is required')
    .matches(
      /^arn:aws:lambda:[a-z\-0-9]+:\d{12}:function:[\w-]+$/,
      'LAMBDA_FUNCTION_ARN must be a valid ARN format',
    ),

  LAMBDA_STORAGE_FUNCTION_ARN: string()
    .required('LAMBDA_FUNCTION_ARN is required')
    .matches(
      /^arn:aws:lambda:[a-z\-0-9]+:\d{12}:function:[\w-]+$/,
      'LAMBDA_FUNCTION_ARN must be a valid ARN format',
    ),

  LAMBDA_HISTORY_FUNCTION_ARN: string()
    .required('LAMBDA_FUNCTION_ARN is required')
    .matches(
      /^arn:aws:lambda:[a-z\-0-9]+:\d{12}:function:[\w-]+$/,
      'LAMBDA_FUNCTION_ARN must be a valid ARN format',
    ),

  LAMBDA_TIMEOUT_SECONDS: number()
    .required('LAMBDA_TIMEOUT_SECONDS is required')
    .min(1, 'LAMBDA_TIMEOUT_SECONDS must be at least 1 second')
    .max(900, 'LAMBDA_TIMEOUT_SECONDS must be at most 900 seconds (15 minutes)'),

  LAMBDA_MEMORY_SIZE: number()
    .required('LAMBDA_MEMORY_SIZE is required')
    .min(128, 'LAMBDA_MEMORY_SIZE must be at least 128 MB')
    .max(10240, 'LAMBDA_MEMORY_SIZE must be at most 10240 MB (10 GB)'),
}).noUnknown('Unknown environment variable detected');

export const envs = environmentVariablesSchema.validateSync(process.env, {
  abortEarly: false,
});
