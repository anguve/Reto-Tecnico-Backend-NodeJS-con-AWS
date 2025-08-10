import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { envs } from '../../src/config/env';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdasPath = path.join(__dirname, '..', '..', 'dist', 'lambdas');
    const commonLambdaEnvironment = {
      AWS_ACCOUNT_ID: envs.AWS_ACCOUNT_ID,
      LAMBDA_MERGE_FUNCTION_ARN: envs.LAMBDA_MERGE_FUNCTION_ARN,
      LAMBDA_STORAGE_FUNCTION_ARN: envs.LAMBDA_STORAGE_FUNCTION_ARN,
      LAMBDA_HISTORY_FUNCTION_ARN: envs.LAMBDA_HISTORY_FUNCTION_ARN,
      LAMBDA_TIMEOUT_SECONDS: envs.LAMBDA_TIMEOUT_SECONDS.toString(),
      LAMBDA_MEMORY_SIZE: envs.LAMBDA_MEMORY_SIZE.toString(),
    };

    const tabla = new dynamodb.Table(this, 'TablaFusionados', {
      tableName: 'FusionadosTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    tabla.addGlobalSecondaryIndex({
      indexName: 'HistoryIndexV2',
      partitionKey: { name: 'historyPartition', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const storageTable = new dynamodb.Table(this, 'TablaStorage', {
      tableName: 'StorageTable',
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
      environment: commonLambdaEnvironment,
    });

    const storageLambda = new lambda.Function(this, 'StorageLambda', {
      functionName: 'StorageLambda',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'storage.handler',
      timeout: cdk.Duration.seconds(envs.LAMBDA_TIMEOUT_SECONDS),
      memorySize: envs.LAMBDA_MEMORY_SIZE,
      code: lambda.Code.fromAsset(lambdasPath, {
        exclude: ['history.*', 'merged.*', '*.ts', '*.d.ts', '*.js.map', '*.d.ts.map'],
      }),
      environment: commonLambdaEnvironment,
    });

    const historyLambda = new lambda.Function(this, 'HistoryLambda', {
      functionName: 'HistoryLambda',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'history.handler',
      timeout: cdk.Duration.seconds(envs.LAMBDA_TIMEOUT_SECONDS),
      memorySize: envs.LAMBDA_MEMORY_SIZE,
      code: lambda.Code.fromAsset(lambdasPath, {
        exclude: ['merged.*', 'storage.*', '*.ts', '*.d.ts', '*.js.map', '*.d.ts.map'],
      }),
      environment: commonLambdaEnvironment,
    });

    tabla.grantReadWriteData(mergedLambda);
    storageTable.grantReadWriteData(storageLambda);
    tabla.grantReadData(historyLambda);

    historyLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [tabla.tableArn, `${tabla.tableArn}/index/HistoryIndexV2`],
      }),
    );

    const api = new apigateway.RestApi(this, 'RimacApi', {
      restApiName: 'Rimac Prueba API',
      deployOptions: {
        stageName: 'prod',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    api.root
      .addResource('fusionados')
      .addMethod('GET', new apigateway.LambdaIntegration(mergedLambda));

    api.root
      .addResource('almacenar')
      .addMethod('POST', new apigateway.LambdaIntegration(storageLambda));

    api.root
      .addResource('historial')
      .addMethod('GET', new apigateway.LambdaIntegration(historyLambda));
  }
}
