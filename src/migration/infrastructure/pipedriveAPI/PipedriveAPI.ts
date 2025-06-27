import { PipedriveAPI } from '../../ports/PipedriveAPI';
import {
  Configuration,
  DealFieldsApi,
  NotesApi,
  OrganizationFieldsApi,
  PersonsApi,
  StagesApi,
  UpsertNoteResponse,
  UsersApi,
} from 'pipedrive/v1';
import {
  OrganizationsApi
} from 'pipedrive/v2';
import { PipedriveDealField } from '../../datastructures/PipedriveDealField';
import { PipedriveStage } from '../../datastructures/PipedriveStage';
import { PipedriveOrganization } from '../../datastructures/PipedriveOrganization';
import { PipedrivePerson } from '../../datastructures/PipedrivePerson';
import { PipedriveOrganizationField } from '../../datastructures/PipedriveOrganizationField';
import { globalConfig } from '../../../config';
import { PipedriveNote } from '../../datastructures/PipedriveNote';
import { PipedriveUser } from '../../datastructures/PipedriveUser';

export class PipedriveAPIImpl implements PipedriveAPI {
  private readonly dealFieldsClient: DealFieldsApi;
  private readonly stagesClient: StagesApi;
  private readonly organizationClient: OrganizationsApi;
  private readonly organizationFieldClient: OrganizationFieldsApi;
  private readonly personClient: PersonsApi;
  private readonly userClient: UsersApi;
  private readonly noteClient: NotesApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });

    this.dealFieldsClient = new DealFieldsApi(configuration);
    this.stagesClient = new StagesApi(configuration);
    this.organizationClient = new OrganizationsApi(configuration);
    this.organizationFieldClient = new OrganizationFieldsApi(configuration);
    this.personClient = new PersonsApi(configuration);
    this.userClient = new UsersApi(configuration);
    this.noteClient = new NotesApi(configuration);
  }

  async upsertNote(dealId: number, noteId: number, text: string): Promise<number> {
    let response: UpsertNoteResponse;

    if (noteId) {
      const note = await this.noteClient.getNote({ id: noteId });
      response = await this.noteClient.updateNote({
        id: noteId,
        NoteRequest: {
          deal_id: dealId,
          content: text,
          user_id: globalConfig.noteUserId,
          pinned_to_deal_flag: 1
        }
      });
    } else {
      response = await this.noteClient.addNote({
        AddNoteRequest: {
          deal_id: dealId,
          content: text,
          user_id: globalConfig.noteUserId,
          pinned_to_deal_flag: 1
        }
      });
    }

    return response.data.id;
  }

  async getNotes(dealId: number): Promise<PipedriveNote[]> {
    const notes = await this.noteClient.getNotes({ start: 0, limit: 500, deal_id: dealId });

    if (!notes.data) {
      return [];
    }

    return notes.data.map((note) => ({
      id: note.id,
      content: note.content,
    }));
  }

  async getDealFields(): Promise<PipedriveDealField[]> {
    const fields = await this.dealFieldsClient.getDealFields({ start: 0, limit: 500 });

    return fields.data.map((field) => ({
      id: field.id,
      key: field.key,
      name: field.name,
      options: field.options,
    }) as PipedriveDealField);
  }

  async getStages(): Promise<PipedriveStage[]> {
    const stages = await this.stagesClient.getStages({ start: 0, limit: 500 });

    return stages.data.map((stage) => ({
      id: stage.id,
      name: stage.name,
    }));
  }

  async getOrganizationFields(): Promise<PipedriveOrganizationField[]> {
    const organizationFields = await this.organizationFieldClient.getOrganizationFields({ start: 0, limit: 500 });

    return organizationFields.data.map((field) => ({
      id: field.id,
      key: field.key,
      name: field.name,
      options: field.options,
    }) as PipedriveOrganizationField);
  }

  async getOrganization(id: number): Promise<PipedriveOrganization> {
    const organization = await this.organizationClient.getOrganization({ id });

    const address = organization.data.address;

    return {
      id: organization.data.id,
      name: organization.data.name,
      address_country: address?.country,
      address_locality: address?.locality,
      address_route: address?.route,
      address_street_number: address?.street_number,
      address_postal_code: address?.postal_code,
      address_admin_area_level_1: address?.admin_area_level_1,
      custom_fields: organization.data['custom_fields'],
    }
  }

  async getPerson(id: number): Promise<PipedrivePerson> {
    const person = await this.personClient.getPerson({ id });

    return {
      id: person.data.id,
      email: person.data.email.find((email) => email.primary) !== undefined ? person.data.email.find((email) => email.primary).value : person.data.email[0]?.value,
      phone: person.data.phone.find((phone) => phone.primary) !== undefined ? person.data.phone.find((phone) => phone.primary).value : person.data.phone[0]?.value,
      first_name: person.data.first_name,
      last_name: person.data.last_name
    }
  }

  async getUser(id: number): Promise<PipedriveUser> {
    const user = await this.userClient.getUser({ id });

    return {
      id: user.data.id,
      name: user.data.name,
      email: user.data.email,
    }
  }
}
