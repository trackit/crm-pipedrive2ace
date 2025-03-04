import { DealField } from "../datastructures/DealField";
import { Stage } from '../datastructures/Stage';
import { Organization } from '../datastructures/Organization';
import { Person } from '../datastructures/Person';
import { OrganizationField } from '../datastructures/OrganizationField';

export interface PipedriveAPI {
  getDealFields: () => Promise<DealField[]>;
  getStages: () => Promise<Stage[]>;
  getOrganization: (id: number) => Promise<Organization>;
  getOrganizationFields: () => Promise<OrganizationField[]>;
  getPerson: (id: number) => Promise<Person>;
}
