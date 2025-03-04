import {
  LambdaFunctionURLEvent,
  LambdaFunctionURLResult,
} from 'aws-lambda';

export const authorizer = async (event: LambdaFunctionURLEvent, func: Promise<any>): Promise<LambdaFunctionURLResult> => {
  if (event.headers['authorization'] == undefined) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    }
  }

  const hash = Buffer.from(process.env.AUTH_USERNAME + ":" + process.env.AUTH_PASSWORD).toString('base64');

  if (event.headers['authorization'] != `Basic ${hash}`) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    }
  }

  return func;
}
