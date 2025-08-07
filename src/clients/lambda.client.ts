import { InvokeCommand } from '@aws-sdk/client-lambda';
import { lambdaClient, LAMBDA_FUNCTION_NAME } from '../config/aws';

export interface LambdaInvokeParams {
  payload?: any;
  invocationType?: 'RequestResponse' | 'Event' | 'DryRun';
}

export class LambdaClient {
  private functionName: string;

  constructor(functionName: string = LAMBDA_FUNCTION_NAME) {
    this.functionName = functionName;
  }

  async invoke(params: LambdaInvokeParams = {}) {
    try {
      const { payload = {}, invocationType = 'RequestResponse' } = params;

      const command = new InvokeCommand({
        FunctionName: this.functionName,
        InvocationType: invocationType,
        Payload: JSON.stringify(payload),
      });

      console.log(`Invoking Lambda function: ${this.functionName}`);

      const response = await lambdaClient.send(command);

      if (response.Payload) {
        const result = JSON.parse(Buffer.from(response.Payload).toString());
        console.log(`Lambda function ${this.functionName} executed successfully`);
        return result;
      }

      return null;
    } catch (error) {
      console.log(`Error invoking Lambda function ${this.functionName}:`, error);
      throw error;
    }
  }

  async getMergedData() {
    return this.invoke({
      payload: { action: 'getMergedData' },
    });
  }
}

export const lambdaInvoker = new LambdaClient();
