import mongoose, { Schema, Document } from 'mongoose';

interface IState extends Document {
  name: string;
  flag: string;
  population: number;
  region: string;
}

const StateSchema = new mongoose.Schema({
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
  
  export default mongoose.model<IState>('State', StateSchema, 'states-collections');
