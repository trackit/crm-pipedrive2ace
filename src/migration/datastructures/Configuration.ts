// Represents a value match mapping.
export interface ValueMapping {
  // The Pipedrive value or ID.
  pipedriveValue: number | string,
  // The PCS value to put in the field for the pipedriveValue.
  pcsValue: number | string | number[] | string[],
}

// Represents a single mapping from Pipedrive to PCS Company.
export interface CompanyFieldMapping {
  // Do not support monetary fields. True if the field is plain value (text, double) and false if it is a set or enum (because they are ids and need to be retrieved from Pipedrive).
  plainValue: boolean,
  // The PCS field.
  opportunityField: string,
  // The value mapping to use. If null, the value is used as is.
  valueMapping: ValueMapping[] | null,
}

// Represents a single mapping from Pipedrive to PCS Opportunity.
export interface OpportunityFieldMapping {
  /*
   * The Pipedrive sub key of the field to map.
   * Pipedrive sub keys types depends on the Pipedrive field type:
   *
   * Field types: Sub key(s)
   *
   * text: value
   * monetary: value, currency
   * set: values
   * enum: id
   * double: value
   */
  pipedriveSubKey: string,
  // The PCS field.
  opportunityField: string,
  // The value mapping to use. If null, the value is used as is.
  valueMapping: ValueMapping[] | null,
}

// Represents a mapping from Pipedrive to PCS Company.
export type CompanyMapping = CompanyMappingOrganization | CompanyMappingDeal;

// Represents a mapping from Pipedrive Organization to PCS Company.
export interface CompanyMappingOrganization {
  // Type of mapping. Either sourced from the Pipedrive deal or the Pipedrive organization. Here it is from the organization.
  from: 'organization',
  // The Pipedrive key of the field to map.
  pipedriveKey: string,
  // The PCS field config to map to.
  mapping: CompanyFieldMapping[],
}

// Represents a mapping from Pipedrive Deal to PCS Company.
export interface CompanyMappingDeal {
  // Type of mapping. Either sourced from the Pipedrive deal or the Pipedrive organization. Here it is from the deal.
  from: 'deal',
  // The Pipedrive key of the field to map.
  pipedriveKey: string,
  // The PCS field config to map to.
  mapping: OpportunityFieldMapping[],
}

// Represents a mapping from Pipedrive to PCS Opportunity.
export interface OpportunityMapping {
  // The Pipedrive key of the field to map.
  pipedriveKey: string,
  // The PCS field config to map to.
  mapping: OpportunityFieldMapping[],
}

// Represents a value mapping from a Pipedrive stage to a PCS stage
export interface StageValueMapping {
  // The Pipedrive stage value ID.
  pipedriveId: number,
  // The PCS stage value
  pcsValue: string,
}

// Represents the global configuration of stages.
export interface StageMapping {
  // List of value mappings from Pipedrive stages to PCS stages. Won/Lost value overrides the stage value mapping.
  valueMapping: StageValueMapping[],
  // The value to put in PCS when the deal is lost.
  lostPcsValue: string,
  // The value to put in PCS when the deal is won.
  wonPcsValue: string,
}

export interface User {
  // The user ID in Pipedrive.
  id: number,
  // The user first name.
  firstName: string,
  // The user last name.
  lastName: string,
  // The user email.
  email: string,
  // The user phone.
  phone: string,
}

// Represents the global configuration.
export interface GlobalConfig {
  // Field mappings for PCS Company.
  companyFieldsMapping: CompanyMapping[],
  // Field mappings for PCS Opportunity.
  opportunityFieldsMapping: OpportunityMapping[],
  // Field that is used to know if the deal will be synchronized or not.
  syncWithAceField: {
    // The field key in Pipedrive that is used to know if the deal will be synchronized or not.
    fieldKey: string,
    // The field value ID in Pipedrive for YES.
    yesValue: number,
    // The field value ID in Pipedrive for NO.
    noValue: number,
  }
  // Global configuration for stages
  stageMapping: StageMapping,
  // List of users in Pipedrive.
  users: User[],
  // User ID used to send the note feedback to the deal in Pipedrive.
  noteUserId: number,
  // The partner name used in the opportunity.
  partnerName: string,
  // Text value in the list of solutions to know if we need to fill the otherSolutions field.
  otherSolutionsValue: string,
}
