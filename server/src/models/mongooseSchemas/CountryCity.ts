import mongoose from 'mongoose';

const CountryCitySchema = new mongoose.Schema({
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
});

export default mongoose.model('CountryCity', CountryCitySchema);
