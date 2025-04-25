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

    const dealInfo = JSON.parse(event.body).data;
    const catalog = dealInfo.title.startsWith('[TEST]') ? 'Sandbox' : 'AWS';

    await this.useCase.migrateDeal({ dealInfo, catalog });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Deal migrated' }),
    }
  }
}
