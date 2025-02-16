export interface ICountry {
  _id?: string;
  name: string;
  flag: string;
  region: string;
  population: number;
  cities?: string[]; // Types.ObjectId
}

export interface ICountryUpdate extends Partial<ICountry> {}
