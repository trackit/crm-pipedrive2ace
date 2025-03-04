import { Deal } from '../../datastructures/Deal';
import { PartnerCentralSellingAPI } from '../../ports/PartnerCentralSellingAPI';
import * as util from 'node:util';
import { PipedriveAPI } from '../../ports/PipedriveAPI';
import { DealField } from '../../datastructures/DealField';
import { DealMapped } from '../../datastructures/DealMapped';
import {
  DealMapping,
  globalConfig,
} from '../../../config';
import { setNestedField } from '../../../shared/FieldUtils';
import { Organization } from '../../datastructures/Organization';
import { Person } from '../../datastructures/Person';
import { PersonMapped } from '../../datastructures/PersonMapped';
import { OrganizationField } from '../../datastructures/OrganizationField';

export type MigrateDealArgs = {
  dealInfo: Deal,
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

  async migrateDeal(dealDefinition: MigrateDealArgs): Promise<void> {
    console.log('Migrating deal')
    console.log(util.inspect(dealDefinition, {showHidden: false, depth: null, colors: false}));

    if (!this.checkWhetherToSyncWithAce(dealDefinition.dealInfo)) {
      return;
    }

    const mappedDeal = await this.mapDeal(dealDefinition.dealInfo);
  }

  private checkWhetherToSyncWithAce(dealDefinition: Deal): boolean {
    const syncWithAceField = globalConfig.syncWithAceField;
    const syncValue = dealDefinition.custom_fields[syncWithAceField.fieldKey];

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

  private async mapDeal(dealDefinition: Deal): Promise<DealMapped> {
    let dealMapped: DealMapped = {
      id: dealDefinition.id,
      title: dealDefinition.title,
      stageId: null, // custom (stage)
      businessProblem: null, // custom GENERIC
      company: null, // custom (organization & person)
      origin: null, // custom GENERIC
      useCase: null, // custom GENERIC
      deliveryModel: null, // custom GENERIC
      competitorName: null, // custom GENERIC
      otherCompetitorNames: null, // custom GENERIC
      expectedCloseDate: dealDefinition.expected_close_date,
      expectedCustomerSpend: {
        currency: null, // custom GENERIC
        amount: null, // custom GENERIC
        frequency: "Monthly",
        target: process.env.PARTNER_NAME,
      },
      primaryNeedsFromAws: null, // custom GENERIC
      salesActivities: null, // custom ???
      type: null, // custom GENERIC
      marketingSource: null, // custom GENERIC
    };

    const dealFieldsDefinitions = await this.pipedriveApi.getDealFields();
    const organizationDefinition = await this.pipedriveApi.getOrganization(dealDefinition.org_id)
    const organizationFieldsDefinition = await this.pipedriveApi.getOrganizationFields();
    const personDefinition = await this.pipedriveApi.getPerson(dealDefinition.person_id)

    this.mapOrganization(dealMapped, dealDefinition, dealFieldsDefinitions, organizationDefinition, organizationFieldsDefinition, personDefinition);

    // Map stage

    this.mapGenericFields(dealMapped, dealDefinition, dealFieldsDefinitions);

    console.info('Mapped deal')
    console.info(util.inspect(dealMapped, {showHidden: false, depth: null, colors: false}));

    return dealMapped;
  }

  private mapGenericFields(dealMapped: DealMapped, dealDefinition: Deal, fieldDefinitions: DealField[]): void {
    for (const customFieldKey in dealDefinition.custom_fields) {
      const customField = dealDefinition.custom_fields[customFieldKey];
      const fieldDefinition = fieldDefinitions.find((field) => field.key === customFieldKey);

      if (fieldDefinition === undefined) {
        console.warn("Unable to find field in pipedrive field list (should not happen)", customFieldKey);
        continue;
      }

      if (customField === null) {
        continue;
      }

      const configField: DealMapping = globalConfig.dealFieldsMapping.find((field) => field.pipedriveKey === customFieldKey);

      if (configField === undefined) {
        continue;
      }

      for (const mapping of configField.mapping) {
        if (mapping.valueMapping === null) {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              setNestedField(dealMapped, mapping.mappedField, fieldDefinition.options.find((option) => option.id === itemId).label);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              setNestedField(dealMapped, mapping.mappedField, fieldDefinition.options.filter((option) => itemIds.includes(option.id)).map((option) => option.label));
              break;
            default:
              setNestedField(dealMapped, mapping.mappedField, customField[mapping.pipedriveSubKey]);
              break;
          }
        } else {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              const enumValue = mapping.valueMapping.find((value) => value.pipedriveValue === itemId)?.pcsValue;
              setNestedField(dealMapped, mapping.mappedField, enumValue);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              const setValues = [];
              for (const itemId of itemIds) {
                setValues.push(mapping.valueMapping.find((value) => value.pipedriveValue === itemId)?.pcsValue);
              }
              setNestedField(dealMapped, mapping.mappedField, setValues);
              break;
            case 'monetary':
              console.warn("Monetary fields not supported with value mapping (skipping)", customField);
              break;
            default:
              const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField[mapping.pipedriveSubKey])?.pcsValue;
              setNestedField(dealMapped, mapping.mappedField, otherValue);
              break;
          }
        }
      }
    }
  }

  private mapOrganization(mappedDeal: DealMapped, dealDefiniton: Deal, dealFieldsDefinition: DealField[], organizationDefinition: Organization, organizationFieldsDefinition: OrganizationField[], personDefinition: Person): void {
    let personMapped: PersonMapped = {
      email: personDefinition.email,
      phone: personDefinition.phone,
      firstName: personDefinition.first_name,
      lastName: personDefinition.last_name,
    }

    let organizationMapped = {
      name: organizationDefinition.name,
      contact: personMapped,
      address: organizationDefinition.address,
      website: null,
      industry: null,
    };

    for (const customFieldKey in organizationDefinition.custom_fields) {
      const configField = globalConfig.organizationFieldsMapping.find((field) => field.pipedriveKey === customFieldKey);

      if (configField === undefined) {
        continue;
      }

      if (configField.from !== 'organization') {
        continue;
      }

      const customField = organizationDefinition.custom_fields[customFieldKey];
      const fieldDefinition = organizationFieldsDefinition.find((field) => field.key === customFieldKey);

      if (fieldDefinition === undefined) {
        console.warn("Unable to find field in pipedrive field list (should not happen)", customFieldKey);
        continue;
      }

      for (const mapping of configField.mapping) {
        if (mapping.valueMapping === null) {
          if (mapping.plainValue) {
            setNestedField(organizationMapped, mapping.mappedField, customField);
          } else {
            if (Array.isArray(customField)) {
              setNestedField(organizationMapped, mapping.mappedField, fieldDefinition.options.filter((option) => customField.includes(option.id)).map((option) => option.label));
            } else if (Number.isInteger(customField)) {
              setNestedField(organizationMapped, mapping.mappedField, fieldDefinition.options.find((option) => option.id === customField).label);
            } else {
              console.warn("Field cannot be plainValue and array of number (skipping)", customField);
            }
          }
        } else {
          if (mapping.plainValue) {
            const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField).pcsValue;
            setNestedField(organizationMapped, mapping.mappedField, otherValue);
          } else {
            if (Array.isArray(customField)) {
              const setValues = [];
              for (const itemId of customField) {
                setValues.push(mapping.valueMapping.find((value) => value.pipedriveValue === itemId).pcsValue);
              }
              setNestedField(organizationMapped, mapping.mappedField, setValues);
            } else if (Number.isInteger(customField)) {
              const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField).pcsValue;
              setNestedField(organizationMapped, mapping.mappedField, otherValue);
            } else {
              console.warn("Field cannot be plainValue and array of number (skipping)", customField);
            }
          }
        }
      }
    }

    for (const customFieldKey in dealDefiniton.custom_fields) {
      const configField = globalConfig.organizationFieldsMapping.find((field) => field.pipedriveKey === customFieldKey);

      if (configField === undefined) {
        continue;
      }

      if (configField.from !== 'deal') {
        continue;
      }

      const customField = dealDefiniton.custom_fields[customFieldKey];
      const fieldDefinition = dealFieldsDefinition.find((field) => field.key === customFieldKey);

      if (fieldDefinition === undefined) {
        console.warn("Unable to find field in pipedrive field list (should not happen)", customFieldKey);
        continue;
      }

      for (const mapping of configField.mapping) {
        if (mapping.valueMapping === null) {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              setNestedField(organizationMapped, mapping.mappedField, fieldDefinition.options.find((option) => option.id === itemId).label);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              setNestedField(organizationMapped, mapping.mappedField, fieldDefinition.options.filter((option) => itemIds.includes(option.id)).map((option) => option.label));
              break;
            default:
              setNestedField(organizationMapped, mapping.mappedField, customField[mapping.pipedriveSubKey]);
              break;
          }
        } else {
          switch (customField.type) {
            case 'enum':
              const itemId = customField[mapping.pipedriveSubKey];
              const enumValue = mapping.valueMapping.find((value) => value.pipedriveValue === itemId).pcsValue;
              setNestedField(organizationMapped, mapping.mappedField, enumValue);
              break;
            case 'set':
              const itemIds = customField[mapping.pipedriveSubKey].map((item: { id: number; }) => item.id);
              const setValues = [];
              for (const itemId of itemIds) {
                setValues.push(mapping.valueMapping.find((value) => value.pipedriveValue === itemId).pcsValue);
              }
              setNestedField(organizationMapped, mapping.mappedField, setValues);
              break;
            case 'monetary':
              console.warn("Monetary fields not supported with value mapping (skipping)", customField);
              break;
            default:
              const otherValue = mapping.valueMapping.find((value) => value.pipedriveValue === customField[mapping.pipedriveSubKey]).pcsValue;
              setNestedField(organizationMapped, mapping.mappedField, otherValue);
              break;
          }
        }
      }
    }

    mappedDeal.company = organizationMapped;
  }
}
