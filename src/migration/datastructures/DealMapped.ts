import { OrganizationMapped } from './OrganizationMapped';

export interface DealMapped {
  id: number,
  title: string,
  stageId: number,
  businessProblem: string,
  company: OrganizationMapped,
  expectedCloseDate: string,
  origin: string,
  useCase: string,
  deliveryModel: string[],
  competitorName: string,
  otherCompetitorNames: string,
  expectedCustomerSpend: {
    currency: string,
    amount: number,
    frequency: string,
    target: string
  },
  primaryNeedsFromAws: string[],
  salesActivities: string[],
  type: string,
  marketingSource: string,
}

    // Missing fields:
    // origin
    // useCase
    // deliveryModel
