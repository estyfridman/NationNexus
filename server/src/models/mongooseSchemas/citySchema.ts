import mongoose, {Schema, Document} from 'mongoose';
import ICity from '../interfaces/iCity';
import {VALID} from '../../constants';

const CitySchema = new Schema<ICity & Document>({
  name: {
    type: String,
    required: [true, VALID.CITY_REQUIRED],
    trim: true,
    minlength: [2, VALID.MIN_LEN_CITY],
    maxlength: [40, VALID.MAX_LEN_CITY],
    match: [/^[a-zA-Z\s-]+$/, VALID.CITY_MATCH],
  },
});

export default mongoose.model<ICity & Document>('City', CitySchema);
