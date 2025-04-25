import { Opportunity } from '../datastructures/Opportunity';

export type OpportunityIds = {
  id: string,
  partnerId: number
}

export type GetOpportunityIdsResult = {
  opportunities: OpportunityIds[];
  nextToken?: string;
};

export interface PartnerCentralSellingAPI {
  getOpportunityIds: (catalog: string, limit: number, nextToken?: string) => Promise<GetOpportunityIdsResult>;
  upsertOpportunity: (catalog: string, opportunity: Opportunity) => Promise<string>;
}
