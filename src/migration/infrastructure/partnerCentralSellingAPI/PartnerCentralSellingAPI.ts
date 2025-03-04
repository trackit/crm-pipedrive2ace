import {
  GetOpportunityIdsResult,
  OpportunityIds,
  PartnerCentralSellingAPI,
} from '../../ports/PartnerCentralSellingAPI';
import {
  CreateOpportunityCommand,
  ListOpportunitiesCommand,
  PartnerCentralSellingClient,
  UpdateOpportunityCommand,
} from '@aws-sdk/client-partnercentral-selling';
import { Opportunity } from '../../datastructures/Opportunity';

export class PartnerCentralSellingAPIImpl implements PartnerCentralSellingAPI {
  private readonly client: PartnerCentralSellingClient;

  constructor() {
    this.client = new PartnerCentralSellingClient({ region: 'us-west-2' });
  }

  public async getOpportunityIds(limit: number = 20, nextToken?: string): Promise<GetOpportunityIdsResult> {
    const command = new ListOpportunitiesCommand({
      Catalog: process.env.CATALOG,
      MaxResults: limit,
      NextToken: nextToken,
    });

    const result = await this.client.send(command);
    return {
      opportunities: result.OpportunitySummaries.map((opportunity) => ({
        id: opportunity.Id,
        partnerId: opportunity.PartnerOpportunityIdentifier
      })),
      nextToken: result.NextToken,
    };
  }

  public async upsertOpportunity(opportunity: Opportunity): Promise<void> {
    let opportunityIds: OpportunityIds[] = [];
    let nextToken: string = undefined;

    do {
      const result = await this.getOpportunityIds(100, nextToken);

      opportunityIds = opportunityIds.concat(result.opportunities);
      nextToken = result.nextToken;
    } while (nextToken !== undefined);

    let opportunityIdToUpdate: string = opportunityIds.find((current) => current.partnerId === opportunity.dealId)?.id;

    const opportunityDetails = {
      PartnerOpportunityIdentifier: opportunity.dealId,
      Project: {
        Title: opportunity.title,
        CustomerBusinessProblem: opportunity.businessProblem,
        CustomerUseCase: opportunity.useCase,
        DeliveryModel: opportunity.deliveryModel,
        ExpectedCustomerSpend: [
          {
            CurrencyCode: opportunity.expectedCustomerSpend.currency,
            Amount: opportunity.expectedCustomerSpend.amount,
            Frequency: opportunity.expectedCustomerSpend.frequency,
            TargetCompany: opportunity.expectedCustomerSpend.target,
          }
        ],
        SalesActivities: opportunity.salesActivities,
        CompetitorName: opportunity.competitorName,
        OtherCompetitorNames: opportunity.otherCompetitorNames,
      },
      LifeCycle: {
        Stage: opportunity.stage,
        TargetCloseDate: opportunity.targetCloseDate,
      },
      Customer: {
        Address: opportunity.company.address,
        Account: {
          CompanyName: opportunity.company.name,
          IndustryVertical: opportunity.company.industry,
          WebsiteUrl: opportunity.company.website,
        },
        Contacts: [
          {
            FirstName: opportunity.company.contact.firstName,
            LastName: opportunity.company.contact.lastName,
            Email: opportunity.company.contact.email,
            Phone: opportunity.company.contact.phone,
          }
        ],
      },
      Origin: opportunity.origin,
      PrimaryNeedsFromAws: opportunity.primaryNeedsFromAws,
      OpportunityType: opportunity.type,
      Marketing: {
        Source: opportunity.marketingSource,
      }
    }

    if (opportunityIdToUpdate) {
      const command = new UpdateOpportunityCommand({
        Catalog: process.env.CATALOG,
        Identifier: opportunityIdToUpdate,
        LastModifiedDate: new Date(),
        ...opportunityDetails,
      });

      await this.client.send(command);
    } else {
      const command = new CreateOpportunityCommand({
        Catalog: process.env.CATALOG,
        ...opportunityDetails
      });

      await this.client.send(command);
    }
  }
}
