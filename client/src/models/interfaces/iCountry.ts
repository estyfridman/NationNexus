
export interface ICountry {
    _id?: string;
    name: string;
    flag: string;
    region: string;
    population: number;
}

export interface ICountryUpdate extends Partial<ICountry> {}