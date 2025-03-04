import { PipedriveAPI } from '../../ports/PipedriveAPI';
import {
  Configuration,
  DealFieldsApi,
  OrganizationFieldsApi,
  PersonsApi,
  StagesApi,
} from 'pipedrive/v1';
import {
  OrganizationsApi
} from 'pipedrive/v2';
import { DealField } from '../../datastructures/DealField';
import { Stage } from '../../datastructures/Stage';
import { Organization } from '../../datastructures/Organization';
import { Person } from '../../datastructures/Person';
import * as util from 'node:util';
import { OrganizationField } from '../../datastructures/OrganizationField';

export class PipedriveAPIImpl implements PipedriveAPI {
  private readonly dealFieldsClient: DealFieldsApi;
  private readonly stagesClient: StagesApi;
  private readonly organizationClient: OrganizationsApi;
  private readonly organizationFieldClient: OrganizationFieldsApi;
  private readonly personClient: PersonsApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });

    this.dealFieldsClient = new DealFieldsApi(configuration);
    this.stagesClient = new StagesApi(configuration);
    this.organizationClient = new OrganizationsApi(configuration);
    this.organizationFieldClient = new OrganizationFieldsApi(configuration);
    this.personClient = new PersonsApi(configuration);
  }

  async getDealFields(): Promise<DealField[]> {
    const fields = await this.dealFieldsClient.getDealFields({ start: 0, limit: 500 });

    return fields.data.map((field) => ({
      id: field.id,
      key: field.key,
      name: field.name,
      options: field.options,
    }) as DealField);
  }

  async getStages(): Promise<Stage[]> {
    const stages = await this.stagesClient.getStages({ start: 0, limit: 500 });

    return stages.data.map((stage) => ({
      id: stage.id,
      name: stage.name,
    }));
  }

  async getOrganizationFields(): Promise<OrganizationField[]> {
    const organizationFields = await this.organizationFieldClient.getOrganizationFields({ start: 0, limit: 500 });

    return organizationFields.data.map((field) => ({
      id: field.id,
      key: field.key,
      name: field.name,
      options: field.options,
    }) as OrganizationField);
  }

  async getOrganization(id: number): Promise<Organization> {
    const organization = await this.organizationClient.getOrganization({ id });

    return {
      id: organization.data.id,
      name: organization.data.name,
      address: organization.data.address.value,
      custom_fields: organization.data['custom_fields'],
    }
  }

  async getPerson(id: number): Promise<Person> {
    const person = await this.personClient.getPerson({ id });

    return {
      id: person.data.id,
      email: person.data.email.find((email) => email.primary) !== undefined ? person.data.email.find((email) => email.primary).value : person.data.email[0]?.value,
      phone: person.data.phone.find((phone) => phone.primary) !== undefined ? person.data.phone.find((phone) => phone.primary).value : person.data.phone[0]?.value,
      first_name: person.data.first_name,
      last_name: person.data.last_name
    }
  }
}
