import {Types} from 'mongoose';
import {MESSAGES} from '../constants';

export const validateObjectId = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(MESSAGES.INVALID_ID);
  }
};
