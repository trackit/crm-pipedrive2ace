export interface PipedriveOrganization {
  id: number,
  name: string,
  address_street_number: string,
  address_route: string,
  address_locality: string,
  address_admin_area_level_1: string,
  address_country: string,
  address_postal_code: string,
  custom_fields: {
    [k: string]: string | number | number[]
  },
}
