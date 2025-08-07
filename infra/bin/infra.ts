import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';
import { envs } from '../../src/config/env';

const app = new cdk.App();

new InfraStack(app, 'InfraStack', {
  env: {
    account: envs.AWS_ACCOUNT_ID,
    region: envs.AWS_REGION,
  },
});
