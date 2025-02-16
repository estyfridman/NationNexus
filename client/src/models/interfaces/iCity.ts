interface ICity {
  _id?: string;
  name: string;
  population: number;
  countryId: string;
}

export default ICity;

export interface ICityUpdate extends Partial<ICity> {}
