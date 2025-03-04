export interface DealField {
  id: number,
  key: string,
  name: string,
  options: {
    id: number,
    label: string,
  }[] | undefined,
}
