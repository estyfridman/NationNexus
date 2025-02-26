interface ICity {
  _id?: string;
  name: string;
}

export default ICity;

export interface ICityUpdate extends Partial<ICity> {}
