import {
  GetOpportunityIdsResult,
  OpportunityIds,
  PartnerCentralSellingAPI,
} from '../../ports/PartnerCentralSellingAPI';
import {
  AssociateOpportunityCommand,
  CountryCode,
  CreateOpportunityCommand,
  DisassociateOpportunityCommand,
  GetOpportunityCommand,
  ListOpportunitiesCommand,
  PartnerCentralSellingClient,
  UpdateOpportunityCommand,
  ValidationException,
} from '@aws-sdk/client-partnercentral-selling';
import { Opportunity } from '../../datastructures/Opportunity';
import { RelatedEntityType } from '@aws-sdk/client-partnercentral-selling/dist-types/models/models_0';

export class PartnerCentralSellingAPIImpl implements PartnerCentralSellingAPI {
  private readonly client: PartnerCentralSellingClient;

  constructor() {
    this.client = new PartnerCentralSellingClient({ region: 'us-east-1' });
  }

  public async getOpportunityIds(catalog: string, limit: number = 20, nextToken?: string): Promise<GetOpportunityIdsResult> {
    const command = new ListOpportunitiesCommand({
      Catalog: catalog,
      MaxResults: limit,
      NextToken: nextToken,
    });

    const result = await this.client.send(command);
    return {
      opportunities: result.OpportunitySummaries.map((opportunity) => ({
        id: opportunity.Id,
        partnerId: parseInt(opportunity.PartnerOpportunityIdentifier),
      })),
      nextToken: result.NextToken,
    };
  }

  public async associateOpportunity(catalog: string, opportunityId: string, relatedEntityType: RelatedEntityType, relatedEntityIdentifier: string): Promise<void> {
    const command = new AssociateOpportunityCommand({
      Catalog: catalog,
      OpportunityIdentifier: opportunityId,
      RelatedEntityType: relatedEntityType,
      RelatedEntityIdentifier: relatedEntityIdentifier,
    });

    await this.client.send(command);
  }

  public async disassociateOpportunity(catalog: string, opportunityId: string, relatedEntityType: RelatedEntityType, relatedEntityIdentifier: string): Promise<void> {
    const command = new DisassociateOpportunityCommand({
      Catalog: catalog,
      OpportunityIdentifier: opportunityId,
      RelatedEntityType: relatedEntityType,
      RelatedEntityIdentifier: relatedEntityIdentifier,
    });

    await this.client.send(command);
  }

  public async upsertOpportunity(catalog: string, opportunity: Opportunity): Promise<string> {
    let opportunityIds: OpportunityIds[] = [];
    let nextToken: string = undefined;
    let opportunityIdToUpdate: string;

    do {
      const result = await this.getOpportunityIds(catalog, 100, nextToken);

      opportunityIds = opportunityIds.concat(result.opportunities);
      nextToken = result.nextToken;
      opportunityIdToUpdate = opportunityIds.find((current) => current.partnerId === opportunity.dealId)?.id;
    } while (nextToken !== undefined && opportunityIdToUpdate === undefined);

    const opportunityDetails = {
      PartnerOpportunityIdentifier: opportunity.dealId.toString(),
      Project: {
        Title: opportunity.title,
        CustomerBusinessProblem: opportunity.businessProblem,
        CustomerUseCase: opportunity.useCase,
        DeliveryModels: opportunity.deliveryModel,
        ExpectedCustomerSpend: [
          {
            CurrencyCode: opportunity.expectedCustomerSpend.currency,
            Amount: opportunity.expectedCustomerSpend.amount.toString(),
            Frequency: opportunity.expectedCustomerSpend.frequency,
            TargetCompany: opportunity.expectedCustomerSpend.target,
          }
        ],
        SalesActivities: opportunity.salesActivities,
        CompetitorName: opportunity.competitorName,
        OtherCompetitorNames: opportunity.otherCompetitorNames,
        OtherSolutionDescription: opportunity.otherSolutions,
      },
      LifeCycle: {
        Stage: opportunity.stage,
        TargetCloseDate: opportunity.targetCloseDate,
      },
      Customer: {
        Account: {
          CompanyName: opportunity.company.name,
          Industry: opportunity.company.industry,
          WebsiteUrl: opportunity.company.website,
          Address: {
            City: opportunity.company.address.city,
            PostalCode: opportunity.company.address.postalCode,
            StateOrRegion: opportunity.company.address.stateOrRegion,
            CountryCode: opportunity.company.address.countryCode as CountryCode,
            StreetAddress: opportunity.company.address.streetAddress,
          },
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
      PrimaryNeedsFromAws: opportunity.primaryNeedsFromAws === null || opportunity.primaryNeedsFromAws.length === 0 ? undefined : opportunity.primaryNeedsFromAws,
      OpportunityType: opportunity.type,
      Marketing: {
        Source: opportunity.marketingSource,
      }
    }

    let returnedOpportunityId: string = opportunityIdToUpdate;

    if (opportunityIdToUpdate) {
      const currentState = await this.client.send(new GetOpportunityCommand({
        Catalog: catalog,
        Identifier: opportunityIdToUpdate,
      }));

      const command = new UpdateOpportunityCommand({
        Catalog: catalog,
        Identifier: opportunityIdToUpdate,
        LastModifiedDate: currentState.LastModifiedDate,
        ...opportunityDetails,
      });

      let error = null;

      try {
        await this.client.send(command);
      } catch (e) {
        console.error('Error sending update opportunity command, trying to associate opportunity anyway:', e);
        error = e;
      }

      if (error instanceof ValidationException) {
        let disassociateSolutionList = currentState.RelatedEntityIdentifiers?.Solutions?.filter((solution) => !opportunity.solutions.includes(solution));
        let disassociateProductList = currentState.RelatedEntityIdentifiers?.AwsProducts?.filter((product) => !opportunity.products.includes(product));
        const associateSolutionList = opportunity.solutions.filter((solution) => !currentState.RelatedEntityIdentifiers.Solutions.includes(solution));
        const associateProductList = opportunity.products.filter((product) => !currentState.RelatedEntityIdentifiers.AwsProducts.includes(product));

        console.log('Disassociate solution list:', disassociateSolutionList);
        console.log('Disassociate product list:', disassociateProductList);
        console.log('Associate solution list:', associateSolutionList);
        console.log('Associate product list:', associateProductList);

        if (!disassociateSolutionList) {
          disassociateSolutionList = [];
        }

        if (!disassociateProductList) {
          disassociateProductList = [];
        }

        for (const solution of disassociateSolutionList) {
          await this.disassociateOpportunity(catalog, opportunityIdToUpdate, 'Solutions', solution);
        }

        for (const product of disassociateProductList) {
          await this.disassociateOpportunity(catalog, opportunityIdToUpdate, 'AwsProducts', product);
        }

        for (const solution of associateSolutionList) {
          await this.associateOpportunity(catalog, opportunityIdToUpdate, 'Solutions', solution);
        }

        for (const product of associateProductList) {
          await this.associateOpportunity(catalog, opportunityIdToUpdate, 'AwsProducts', product);
        }
      }

      if (error) {
        throw error;
      }
    } else {
      const command = new CreateOpportunityCommand({
        Catalog: catalog,
        ...opportunityDetails
      });

      const createResult = await this.client.send(command);
      returnedOpportunityId = createResult.Id;

      for (const solution of opportunity.solutions) {
        await this.associateOpportunity(catalog, createResult.Id, 'Solutions', solution);
      }

      for (const products of opportunity.products) {
        await this.associateOpportunity(catalog, createResult.Id, 'AwsProducts', products);
      }
    }

    return returnedOpportunityId;
  }
}
