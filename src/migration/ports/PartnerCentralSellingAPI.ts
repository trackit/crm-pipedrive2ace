import { Opportunity } from '../datastructures/Opportunity';

export type OpportunityIds = {
  id: string,
  partnerId: string
}

export type GetOpportunityIdsResult = {
  opportunities: OpportunityIds[];
  nextToken?: string;
};

export interface PartnerCentralSellingAPI {
  getOpportunityIds: (limit: number, nextToken?: string) => Promise<GetOpportunityIdsResult>;
  upsertOpportunity: (opportunity: Opportunity) => Promise<void>;
}
