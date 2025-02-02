import mongoose from 'mongoose';
import ICountry from '../interfaces/iCountry';

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
  
export default mongoose.model<ICountry>('Country', CountrySchema);
