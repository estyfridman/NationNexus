import ICity from './iCity';

export interface ICountry {
  _id?: string;
  name: string;
  flag: string;
  region: string;
  population: number;
  cityIds?: ICity[];
}

export interface ICountryUpdate extends Partial<ICountry> {}
