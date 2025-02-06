import { Types } from 'mongoose';

interface ICity {
  name: string;
  population: number;
  country: Types.ObjectId;
}

export default ICity;
