import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { envs } from '../../src/config/env';
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdasPath = path.join(__dirname, '..', '..', 'dist', 'lambdas');

    const mergedLambda = new lambda.Function(this, 'MergedLambda', {
      functionName: 'MergedLambda',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'merged.handler',
      timeout: cdk.Duration.seconds(envs.LAMBDA_TIMEOUT_SECONDS),
      memorySize: envs.LAMBDA_MEMORY_SIZE,
      code: lambda.Code.fromAsset(lambdasPath, {
        exclude: ['history.*', 'storage.*', '*.ts', '*.d.ts', '*.js.map', '*.d.ts.map'],
      }),
    });

    const api = new apigateway.RestApi(this, 'RimacApi', {
      restApiName: 'Rimac Prueba API',
      deployOptions: {
        stageName: 'prod',
      },
    });

    api.root
      .addResource('fusionados')
      .addMethod('GET', new apigateway.LambdaIntegration(mergedLambda));
  }
}
