import { PipedriveDeal } from '../../datastructures/PipedriveDeal';
import { PartnerCentralSellingAPI } from '../../ports/PartnerCentralSellingAPI';
import * as util from 'node:util';
import { PipedriveAPI } from '../../ports/PipedriveAPI';
import { PipedriveDealField } from '../../datastructures/PipedriveDealField';
import {
  globalConfig,
} from '../../../config';
import { setNestedField } from '../../../shared/FieldUtils';
import { PipedriveOrganization } from '../../datastructures/PipedriveOrganization';
import { PipedrivePerson } from '../../datastructures/PipedrivePerson';
import { PipedriveOrganizationField } from '../../datastructures/PipedriveOrganizationField';
import {
  CountryCodeMap,
  Opportunity,
  OPPORTUNITY_STAGES,
  OpportunityCompany,
  OpportunityCompanyContact,
  OpportunityStage,
} from '../../datastructures/Opportunity';
import { ValidationException } from '@aws-sdk/client-partnercentral-selling';

export type MigrateDealArgs = {
  dealInfo: PipedriveDeal,
  catalog: string,
}

export interface MigrateDealUseCase {
  migrateDeal(deal: MigrateDealArgs): Promise<void>
}

export class MigrateDealUseCaseImpl implements MigrateDealUseCase {
  private readonly pcsApi: PartnerCentralSellingAPI;
  private readonly pipedriveApi: PipedriveAPI;

  constructor({
    pcsApi,
    pipedriveApi,
  }: {
    pcsApi: PartnerCentralSellingAPI,
    pipedriveApi: PipedriveAPI,
  }) {
    this.pcsApi = pcsApi
    this.pipedriveApi = pipedriveApi
  }

  public async migrateDeal(args: MigrateDealArgs): Promise<void> {
    console.log('MIGRATING DEAL');
    console.log('Received Pipedrive deal:');
    console.log(util.inspect(args, {showHidden: false, depth: null, colors: false}));
    console.log('Catalog:', args.catalog);

    if (!this.checkSyncWithAce(args.dealInfo)) {
      return;
    }

    try {
      const opportunity = await this.mapDeal(args.dealInfo);

      console.info('Mapped opportunity to upsert:');
      console.info(util.inspect(opportunity, {showHidden: false, depth: null, colors: false}));

      const opportunityId = await this.pcsApi.upsertOpportunity(args.catalog, opportunity);
      await this.updateStatusInNote(args.dealInfo.id, true, opportunityId, null);
      console.info('Opportunity upserted with ID:', opportunityId);
    } catch (e: unknown) {
      console.error("Error while syncing with ACE: ", e);

      if (e instanceof ValidationException) {
        console.error("Validation error: ", e);
        await this.updateStatusInNote(args.dealInfo.id, false, null, e.ErrorList.map(error => `❌ ${error.Message}`).join('<br/>'));
      } else {
        console.error("Unknown error: ", e);
        await this.updateStatusInNote(args.dealInfo.id, false, null, "❌ Unknown error: this is mostly an error in the system, please contact the developer.");
      }
    }

    console.info('END OF MIGRATION');
  }

  private async updateStatusInNote(dealId: number, success: boolean, opportunityId: string, error: string): Promise<void> {
    const notes = await this.pipedriveApi.getNotes(dealId);

    const note = notes.find((note) => note.content.startsWith("[ACE]"));
    await this.pipedriveApi.upsertNote(dealId, note ? note.id : null, `[ACE] Sync status: ${success ? "Success" : "Failed"} - Opportunity ID: ${opportunityId ? opportunityId : "N/A"} - Last ${success ? 'update' : 'attempt'}: ${this.getDate()} ${error ? ` - ❌ Expand for errors ⬇️ <br/>${error}` : ' ✅'}`);
  }

  private getDate(): string {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} `;
  }

  private checkSyncWithAce(dealDefinition: PipedriveDeal): boolean {
    const syncWithAceField = globalConfig.syncWithAceField;
    const syncValue = dealDefinition.custom_fields[syncWithAceField.fieldKey];

    if (!syncValue) {
      console.warn('Sync field is not set', syncValue);
      return false;
    }

    if (syncValue.type !== 'enum') {
      console.warn('Sync field is not an enum', syncValue);
      return false;
    }

    if (syncValue.id === syncWithAceField.yesValue) {
      console.info('Syncing with ACE');
      return true;
    } else if (syncValue.id === syncWithAceField.noValue) {
      console.info('Not syncing with ACE');
      return false;
    } else {
      console.warn('Unknown value for sync field, not syncing', syncValue);
      return false;
    }
  }

  private async mapDeal(dealDefinition: PipedriveDeal): Promise<Opportunity> {
    let opportunity: Opportunity = {
      dealId: dealDefinition.id,
      title: dealDefinition.title,
      stage: null,
      businessProblem: null,
      company: null,
      competitorName: null,
      otherCompetitorNames: null,
      targetCloseDate: dealDefinition.expected_close_date,
      origin: null,
      useCase: null,
      deliveryModel: null,
      updateTime: dealDefinition.update_time,
      expectedCustomerSpend: {
        currency: null,
        amount: null,
        frequency: "Monthly",
        target: globalConfig.partnerName,
      },
      primaryNeedsFromAws: null,
      salesActivities: null,
      type: null,
      marketingSource: null,
      solutions: null,
      otherSolutions: null,
      products: null,
    };

    const dealFieldsDefinitions = await this.pipedriveApi.getDealFields();
    const organizationDefinition = await this.pipedriveApi.getOrganization(dealDefinition.org_id);
    const organizationFieldsDefinition = await this.pipedriveApi.getOrganizationFields();
    const personDefinition = await this.pipedriveApi.getPerson(dealDefinition.person_id);

    this.mapOrganization(opportunity, dealDefinition, dealFieldsDefinitions, organizationDefinition, organizationFieldsDefinition, personDefinition);
    this.mapStage(opportunity, dealDefinition);
    this.mapGenericFields(opportunity, dealDefinition, dealFieldsDefinitions);
    this.mapSolutions(opportunity);

    return opportunity;
  }

  private mapOrganization(opportunity: Opportunity, dealDefiniton: PipedriveDeal, dealFieldsDefinition: PipedriveDealField[], organizationDefinition: PipedriveOrganization, organizationFieldsDefinition: PipedriveOrganizationField[], personDefinition: PipedrivePerson): void {
    let personMapped: OpportunityCompanyContact = {
      email: personDefinition.email,
      phone: personDefinition.phone,
      firstName: personDefinition.first_name,
      lastName: personDefinition.last_name,
    }

    let organizationMapped: OpportunityCompany = {
      name: organizationDefinition.name,
      contact: personMapped,
      address: {
        city: organizationDefinition.address_locality,
        countryCode: organizationDefinition.address_country ? CountryCodeMap[organizationDefinition.address_country.replace(' ', '')] : null,
        stateOrRegion: organizationDefinition.address_admin_area_level_1,
        streetAddress: organizationDefinition.address_street_number && organizationDefinition.address_route ? `${organizationDefinition.address_street_number} ${organizationDefinition.address_route}` : null,
        postalCode: organizationDefinition.address_postal_code,
      },
      website: null,
      industry: null,
    };

    // Map OpportunityCompany from Pipedrive organization
    for (const customFieldKey in organizationDefinition.custom_fields) {
      const configField = globalConfig.companyFieldsMapping.find((field) => field.pipedriveKey === customFieldKey);
      if (!configField || configField.from !== 'organization') {
        continue;
      }

      const customField = organizationDefinition.custom_fields[customFieldKey];
      if (!customField) {
        continue;
      }

      const fieldDefinition = organizationFieldsDefinition.find((field) => field.key === customFieldKey);
      if (!fieldDefinition) {
        console.warn("Unable to find field in pipedrive field list (should not happen)", customFieldKey);
        continue;
      }

      for (const mapping of configField.mapping) {
        if (!mapping.valueMapping) {
          if (mapping.plainValue) {
            setNestedField(organizationMapped, mapping.opportunityField, customField);
          } else {
            if (Array.isArray(customField)) {
              setNestedField(organizationMapped, mapping.opportunityField, fieldDefinition.options.filter((option) => customField.includes(option.id)).map((option) => option.label));
            } else if (Number.isInteger(customField)) {
              setNestedField(organizationMapped, mapping.opportunityField, fieldDefinition.options.find((option) => option.id === customField).label);
            } else {
              console.warn("Field cannot be plainValue and array of number (skipping)", customField);
            }
          }
        } else {
          if (mapping.plainValue) {
            const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField).pcsValue;
            setNestedField(organizationMapped, mapping.opportunityField, otherValue);
          } else {
            if (Array.isArray(customField)) {
              const setValues = [];
              for (const itemId of customField) {
                setValues.push(mapping.valueMapping.find((value) => value.pipedriveValue === itemId).pcsValue);
              }
              setNestedField(organizationMapped, mapping.opportunityField, setValues);
            } else if (Number.isInteger(customField)) {
              const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField).pcsValue;
              setNestedField(organizationMapped, mapping.opportunityField, otherValue);
            } else {
              console.warn("Field cannot be plainValue and array of number (skipping)", customField);
            }
          }
        }
      }
    }

    // Map OpportunityCompany from Pipedrive deal
    for (const customFieldKey in dealDefiniton.custom_fields) {
      const configField = globalConfig.companyFieldsMapping.find((field) => field.pipedriveKey === customFieldKey);
      if (!configField || configField.from !== 'deal') {
        continue;
      }

      const customField = dealDefiniton.custom_fields[customFieldKey];
      if (!customField) {
        continue;
      }

      const fieldDefinition = dealFieldsDefinition.find((field) => field.key === customFieldKey);
      if (!fieldDefinition) {
        console.warn("Unable to find field in pipedrive field list (should not happen)", customFieldKey);
        continue;
      }

      for (const mapping of configField.mapping) {
        if (!mapping.valueMapping) {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              setNestedField(organizationMapped, mapping.opportunityField, fieldDefinition.options.find((option) => option.id === itemId).label);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              setNestedField(organizationMapped, mapping.opportunityField, fieldDefinition.options.filter((option) => itemIds.includes(option.id)).map((option) => option.label));
              break;
            default:
              setNestedField(organizationMapped, mapping.opportunityField, customField[mapping.pipedriveSubKey]);
              break;
          }
        } else {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              const enumValue = mapping.valueMapping.find((value) => value.pipedriveValue === itemId).pcsValue;
              setNestedField(organizationMapped, mapping.opportunityField, enumValue);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              const setValues = [];
              for (const itemId of itemIds) {
                setValues.push(mapping.valueMapping.find((value) => value.pipedriveValue === itemId).pcsValue);
              }
              setNestedField(organizationMapped, mapping.opportunityField, setValues);
              break;
            case 'monetary':
              console.warn("Monetary fields not supported with value mapping (skipping)", customField);
              break;
            default:
              const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField[mapping.pipedriveSubKey]).pcsValue;
              setNestedField(organizationMapped, mapping.opportunityField, otherValue);
              break;
          }
        }
      }
    }

    opportunity.company = organizationMapped;
  }

  private mapStage(opportunity: Opportunity, dealDefinition: PipedriveDeal): void {
    let stageValue = globalConfig.stageMapping.valueMapping.find((stage) => stage.pipedriveId === dealDefinition.stage_id).pcsValue;

    if (dealDefinition.won_time) {
      stageValue = globalConfig.stageMapping.wonPcsValue;
    } else if (dealDefinition.lost_time) {
      stageValue = globalConfig.stageMapping.lostPcsValue;
    }

    if (!stageValue) {
      console.warn("Unable to find stage in pipedrive stage list (should not happen)", dealDefinition.stage_id);
      return;
    }

    if (!this.isOpportunityStage(stageValue)) {
      console.warn("Stage value is not a valid opportunity stage", stageValue);
      return;
    }

    opportunity.stage = stageValue;
  }

  private isOpportunityStage(value: string): value is OpportunityStage {
    return OPPORTUNITY_STAGES.includes(value as any);
  }

  private mapGenericFields(opportunity: Opportunity, dealDefinition: PipedriveDeal, fieldDefinitions: PipedriveDealField[]): void {
    for (const customFieldKey in dealDefinition.custom_fields) {
      const customField = dealDefinition.custom_fields[customFieldKey];
      if (!customField) {
        continue;
      }

      const configField = globalConfig.opportunityFieldsMapping.find((field) => field.pipedriveKey === customFieldKey);
      if (!configField) {
        continue;
      }

      const fieldDefinition = fieldDefinitions.find((field) => field.key === customFieldKey);
      if (!fieldDefinition) {
        console.warn("Unable to find field in pipedrive field list (should not happen)", customFieldKey);
        continue;
      }

      for (const mapping of configField.mapping) {
        if (!mapping.valueMapping) {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              setNestedField(opportunity, mapping.opportunityField, fieldDefinition.options.find((option) => option.id === itemId).label);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              setNestedField(opportunity, mapping.opportunityField, fieldDefinition.options.filter((option) => itemIds.includes(option.id)).map((option) => option.label));
              break;
            default:
              setNestedField(opportunity, mapping.opportunityField, customField[mapping.pipedriveSubKey]);
              break;
          }
        } else {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              const enumValue = mapping.valueMapping.find((value) => value.pipedriveValue === itemId)?.pcsValue;
              setNestedField(opportunity, mapping.opportunityField, enumValue);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              const setValues = [];
              for (const itemId of itemIds) {
                setValues.push(mapping.valueMapping.find((value) => value.pipedriveValue === itemId)?.pcsValue);
              }
              setNestedField(opportunity, mapping.opportunityField, setValues);
              break;
            case 'monetary':
              console.warn("Monetary fields not supported with value mapping (skipping)", customField);
              break;
            default:
              const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField[mapping.pipedriveSubKey])?.pcsValue;
              setNestedField(opportunity, mapping.opportunityField, otherValue);
              break;
          }
        }
      }
    }
  }

  private mapSolutions(opportunity: Opportunity): void {
    const solutionIds = [];

    for (const solution of opportunity.solutions) {
      const regex = /S-\d{7}/;
      const match = solution.match(regex);
      if (solution === globalConfig.otherSolutionsValue) {
        solutionIds.splice(0, solutionIds.length);
        break;
      }
      if (!match) {
        console.warn("Unable to find solution id in solution name", solution);
        continue;
      }

      const solutionId = match[0];
      solutionIds.push(solutionId);
    }

    opportunity.solutions = solutionIds;
  }
}
