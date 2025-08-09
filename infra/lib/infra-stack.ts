import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { envs } from '../../src/config/env';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdasPath = path.join(__dirname, '..', '..', 'dist', 'lambdas');

    const tabla = new dynamodb.Table(this, 'TablaFusionados', {
      tableName: 'FusionadosTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const mergedLambda = new lambda.Function(this, 'MergedLambda', {
      functionName: 'MergedLambda',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'merged.handler',
      timeout: cdk.Duration.seconds(envs.LAMBDA_TIMEOUT_SECONDS),
      memorySize: envs.LAMBDA_MEMORY_SIZE,
      code: lambda.Code.fromAsset(lambdasPath, {
        exclude: ['history.*', 'storage.*', '*.ts', '*.d.ts', '*.js.map', '*.d.ts.map'],
      }),
      environment: {
        AWS_ACCOUNT_ID: envs.AWS_ACCOUNT_ID,
        LAMBDA_MERGE_FUNCTION_ARN: envs.LAMBDA_MERGE_FUNCTION_ARN,
        LAMBDA_TIMEOUT_SECONDS: envs.LAMBDA_TIMEOUT_SECONDS.toString(),
        LAMBDA_MEMORY_SIZE: envs.LAMBDA_MEMORY_SIZE.toString(),
      },
    });

    tabla.grantReadWriteData(mergedLambda);

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
