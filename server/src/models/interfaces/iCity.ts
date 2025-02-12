import { Types } from 'mongoose';

interface ICity {
  _id?: Types.ObjectId;
  name: string;
  population: number;
  countryId: Types.ObjectId;
}

export default ICity;
