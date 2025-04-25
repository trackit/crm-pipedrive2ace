import {
  LambdaFunctionURLEvent,
  LambdaFunctionURLResult,
} from 'aws-lambda';
import { MigrateDealAdapter } from './migrateDeal.adapter';
import { MigrateDealUseCaseImpl } from '../useCases/migrateDeal/migrateDeal';
import { PartnerCentralSellingAPIImpl } from '../infrastructure/partnerCentralSellingAPI/PartnerCentralSellingAPI';
import { authorizer } from '../../shared/HttpAuthorizer';
import { PipedriveAPIImpl } from '../infrastructure/pipedriveAPI/PipedriveAPI';

const pcsApi = new PartnerCentralSellingAPIImpl();
const pipedriveApi = new PipedriveAPIImpl(process.env.PIPEDRIVE_API_KEY);

const useCase = new MigrateDealUseCaseImpl({
  pcsApi,
  pipedriveApi,
});

const adapter = new MigrateDealAdapter({
  useCase
});

export const main = (
  event: LambdaFunctionURLEvent,
): Promise<LambdaFunctionURLResult> => authorizer(event, adapter.handle(event));
