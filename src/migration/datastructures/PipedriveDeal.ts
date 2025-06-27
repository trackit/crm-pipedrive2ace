export interface PipedriveDeal {
  id: number,
  owner_id: number,
  title: string,
  stage_id: number,
  currency: string,
  value: number,
  expected_close_date: string,
  org_id: number,
  person_id: number,
  won_time: string,
  lost_time: string,
  update_time: string,
  custom_fields: {
    [key: string]: {
      type: 'set',
      values: [
        {
          id: number,
        }
      ]
    } | {
      type: 'enum',
      id: number,
    } | {
      type: 'monetary',
      value: number,
      currency: string,
    } | {
      type: 'text',
      value: string,
    } | {
      type: 'double',
      value: number,
    } | null;
  }
}
