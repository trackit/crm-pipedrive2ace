import { PipedriveDealField } from "../datastructures/PipedriveDealField";
import { PipedriveStage } from '../datastructures/PipedriveStage';
import { PipedriveOrganization } from '../datastructures/PipedriveOrganization';
import { PipedrivePerson } from '../datastructures/PipedrivePerson';
import { PipedriveOrganizationField } from '../datastructures/PipedriveOrganizationField';
import { PipedriveNote } from '../datastructures/PipedriveNote';
import { PipedriveUser } from '../datastructures/PipedriveUser';

export interface PipedriveAPI {
  getDealFields: () => Promise<PipedriveDealField[]>;
  getStages: () => Promise<PipedriveStage[]>;
  getOrganization: (id: number) => Promise<PipedriveOrganization>;
  getOrganizationFields: () => Promise<PipedriveOrganizationField[]>;
  getPerson: (id: number) => Promise<PipedrivePerson>;
  upsertNote: (dealId: number, noteId: number, text: string) => Promise<number>;
  getNotes: (dealId: number) => Promise<PipedriveNote[]>;
}
