export interface Organization {
  id: number,
  name: string,
  address: string,
  custom_fields: {
    [k: string]: string | number | number[]
  },
}
