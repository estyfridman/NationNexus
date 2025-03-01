import mongoose from 'mongoose';

export default interface ICountry {
  _id?: string;
  name: string;
  flag: string;
  region: string;
  population: number;
  cityIds: mongoose.Types.ObjectId[];
}
