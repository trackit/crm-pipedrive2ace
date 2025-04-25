export interface ValueMapping {
  pipedriveValue: number | string,
  pcsValue: number | string | number[] | string[],
}

export interface OrganizationFieldMapping {
  plainValue: boolean,
  opportunityField: string,
  valueMapping: ValueMapping[] | null,
}

export interface DealFieldMapping {
  pipedriveSubKey: string,
  opportunityField: string,
  valueMapping: ValueMapping[] | null,
}

export type OrganizationMapping = OrganizationMappingOrganization | OrganizationMappingDeal;

export interface OrganizationMappingOrganization {
  from: 'organization',
  pipedriveKey: string,
  mapping: OrganizationFieldMapping[],
}

export interface OrganizationMappingDeal {
  from: 'deal',
  pipedriveKey: string,
  mapping: DealFieldMapping[],
}


export interface DealMapping {
  pipedriveKey: string,
  mapping: DealFieldMapping[],
}

export interface StageValueMapping {
  pipedriveId: number,
  pcsValue: string,
}

export interface StageMapping {
  valueMapping: StageValueMapping[],
  lostPcsValue: string,
  wonPcsValue: string,
}

export interface GlobalConfig {
  organizationFieldsMapping: OrganizationMapping[],
  dealFieldsMapping: DealMapping[],
  syncWithAceField: {
    fieldKey: string,
    yesValue: number,
    noValue: number,
  }
  stageMapping: StageMapping,
  noteUserId: number,
  partnerName: string,
  otherSolutionsValue: string,
}
