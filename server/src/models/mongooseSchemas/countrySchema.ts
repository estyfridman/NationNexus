import mongoose, {Schema} from 'mongoose';
import ICountry from '../interfaces/iCountry';
import {VALID_REGIONS} from '../enums/regionEnum';
import {VALID} from '../../constants';
import {validationMessages} from '../../utils/validationMessages';
const getInvalidRegionMessage = (value: string) => validationMessages.invalidRegion(value, Array.from(VALID_REGIONS));

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, VALID.COUNTRY_REQUIRE],
    unique: true,
    trim: true,
    minlength: [2, VALID.MIN_LEN_COUNTRY],
    maxlength: [40, VALID.MAX_LEN_COUNTRY],
    validate: {
      validator: function (v: string) {
        return /^[A-Za-z\s]+$/.test(v);
      },
      message: VALID.COUNTRY_MATCH,
    },
  },
  flag: {
    type: String,
    required: [true, VALID.REQUIRED_FLAG],
  },
  population: {
    type: Number,
    required: [false, VALID.OPTIONAL_PPL],
    min: [0, VALID.PPL_MIN_LEN],
    max: [10000000000, VALID.PPL_MAX_LEN],
    validate: {
      validator: Number.isInteger,
      message: VALID.INTEGER_PPL,
    },
  },
  region: {
    type: String,
    required: [true, VALID.REGION_REQUIRED],
    trim: true,
    enum: {
      values: VALID_REGIONS,
      message: getInvalidRegionMessage as unknown as string,
    },
  },
  cityIds: [{type: Schema.Types.ObjectId, ref: 'City'}],
});

export default mongoose.model<ICountry>('Country', CountrySchema);
