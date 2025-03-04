import {
  LambdaFunctionURLEvent,
  LambdaFunctionURLResult,
} from 'aws-lambda';
import {
  BadRequestError,
  handleHttpRequest,
} from '../../shared/HttpErrors';
import { MigrateDealUseCase } from '../useCases/migrateDeal/migrateDeal';

export class MigrateDealAdapter {
  private readonly useCase: MigrateDealUseCase;

  public constructor({ useCase }: { useCase: MigrateDealUseCase }) {
    this.useCase = useCase;
  }

  public async handle(event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> {
    return handleHttpRequest({
      event,
      func: this.processRequest.bind(this)
    })
  }

  private async processRequest(event: LambdaFunctionURLEvent): Promise<LambdaFunctionURLResult> {
    if (event.body == undefined) {
      throw new BadRequestError()
    }

    const body = JSON.parse(event.body);

    // TODO: TO REMOVE
    if (!body.data.title.startsWith('[TEST]')) {
      console.log('Deal not migrated');
      console.log(body.data.title)
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Deal not migrated' }),
      }
    }

    await this.useCase.migrateDeal({ dealInfo: body.data });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Deal migrated' }),
    }
  }
}
