import mongoose from 'mongoose';
import ICountry from '../interfaces/iCountry';
import { RegionEnum } from '../regionEnum'

const CountrySchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Country name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Country name must be at least 2 characters long'],
      maxlength: [40, 'Country name cannot exceed 40 characters'],
      validate: {
        validator: function(v: string) {
          return /^[A-Za-z\s]+$/.test(v);
        },
        message: 'Country name must contain only letters and spaces'
      }
    },
    flag: {
      type: String,
      required: [true, 'Flag URL is required'],
    },
    population: {
      type: Number,
      required: [false, 'Population is optional'],
      min: [0, 'Population cannot be negative'],
      max: [10000000000, 'Population is unrealistically high'],
      validate: {
        validator: Number.isInteger,
        message: 'Population must be an integer'
      }
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
      enum: Object.values(RegionEnum),
    },
});
  
export default mongoose.model<ICountry>('Country', CountrySchema);
