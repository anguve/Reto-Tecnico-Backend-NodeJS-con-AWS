import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as logs from 'aws-cdk-lib/aws-logs';

import { envs } from '../../src/config/env';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const USER_POOL_ID = 'us-east-2_CWKyxA9IV';

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

    const lambdasPath = path.join(__dirname, '..', '..', 'dist', 'lambdas');

    const commonLambdaEnvironment = {
      AWS_ACCOUNT_ID: envs.AWS_ACCOUNT_ID,
      LAMBDA_MERGE_FUNCTION_ARN: envs.LAMBDA_MERGE_FUNCTION_ARN,
      LAMBDA_STORAGE_FUNCTION_ARN: envs.LAMBDA_STORAGE_FUNCTION_ARN,
      LAMBDA_HISTORY_FUNCTION_ARN: envs.LAMBDA_HISTORY_FUNCTION_ARN,
      LAMBDA_TIMEOUT_SECONDS: envs.LAMBDA_TIMEOUT_SECONDS.toString(),
      LAMBDA_MEMORY_SIZE: envs.LAMBDA_MEMORY_SIZE.toString(),
    };

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
      tracing: lambda.Tracing.ACTIVE,
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
      tracing: lambda.Tracing.ACTIVE,
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
      tracing: lambda.Tracing.ACTIVE,
    });

    const xrayPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess');
    mergedLambda.role?.addManagedPolicy(xrayPolicy);
    storageLambda.role?.addManagedPolicy(xrayPolicy);
    historyLambda.role?.addManagedPolicy(xrayPolicy);

    tabla.grantReadWriteData(mergedLambda);
    storageTable.grantReadWriteData(storageLambda);
    tabla.grantReadData(historyLambda);

    historyLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [tabla.tableArn, `${tabla.tableArn}/index/HistoryIndexV2`],
      }),
    );

    const apiGwLogsRole = new iam.Role(this, 'ApiGatewayCloudWatchRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonAPIGatewayPushToCloudWatchLogs',
        ),
      ],
    });

    const apiGwAccount = new apigateway.CfnAccount(this, 'ApiGatewayAccountCloudWatch', {
      cloudWatchRoleArn: apiGwLogsRole.roleArn,
    });

    const accessLogsGroup = new logs.LogGroup(this, 'ApiAccessLogs', {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPool = cognito.UserPool.fromUserPoolId(this, 'ImportedUserPool', USER_POOL_ID);

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      authorizerName: 'RimacCognitoAuthorizer',
      cognitoUserPools: [userPool],
      identitySource: apigateway.IdentitySource.header('Authorization'),
    });

    const api = new apigateway.RestApi(this, 'RimacApi', {
      restApiName: 'Rimac Prueba API',
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: false,
        metricsEnabled: true,
        accessLogDestination: new apigateway.LogGroupLogDestination(accessLogsGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          caller: true,
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          user: true,
        }),

        throttlingRateLimit: 10,
        throttlingBurstLimit: 20,

        methodOptions: {
          '/fusionados/GET': {
            throttlingRateLimit: 2,
            throttlingBurstLimit: 5,
          },
          '/almacenar/POST': {
            throttlingRateLimit: 1,
            throttlingBurstLimit: 2,
          },
          '/historial/GET': {
            throttlingRateLimit: 1,
            throttlingBurstLimit: 2,
          },
        },
        tracingEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    api.node.addDependency(apiGwAccount);

    api.root
      .addResource('fusionados')
      .addMethod('GET', new apigateway.LambdaIntegration(mergedLambda), {
        authorizationType: apigateway.AuthorizationType.NONE,
      });

    api.root
      .addResource('almacenar')
      .addMethod('POST', new apigateway.LambdaIntegration(storageLambda), {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      });

    api.root
      .addResource('historial')
      .addMethod('GET', new apigateway.LambdaIntegration(historyLambda), {
        authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
      });

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'UserPoolId', { value: USER_POOL_ID });
  }
}
