import { PersonMapped } from './PersonMapped';

export interface OrganizationMapped {
  name: string,
  contact: PersonMapped,
  address: string,
  website: string,
  industry: string,
}
