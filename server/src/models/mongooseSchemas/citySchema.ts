import mongoose, { Schema, Document } from 'mongoose';
import ICity from '../interfaces/iCity';

const CitySchema = new Schema<ICity & Document>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  population: {
    type: Number,
    required: true,
    min: 0,
  },
  countryId: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
});

export default mongoose.model<ICity & Document>('City', CitySchema);
