import mongoose, { Document } from 'mongoose';

interface ICountry extends Document {
  name: string;
  flag: string;
  population: number;
  region: string;
}

const dbName = 'HMOMembers';
const collectionName = 'countries';

const CountrySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    flag: {
      type: String,
      required: true,
    },
    population: {
      type: Number,
      required: false,
      min: 0
    },
    region: {
      type: String,
      required: true,
    },
  });
  
// const Country = connection.model<ICountry>(collectionName, CountrySchema, dbName);

// export default Country;

export default mongoose.model<ICountry>('Country', CountrySchema);
