import * as Yup from 'yup';
import {RegionEnum} from '../../../../shared/enums';

export const countrySchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters long').max(40, 'Name must not exceed 40 characters').required('Name is required'),
  flag: Yup.string().url('Must be a valid URL').required('Flag URL is required'),
  region: Yup.string().oneOf(Object.values(RegionEnum), 'Invalid role').required('Region is required'),
  population: Yup.number()
    .positive('Population must be a positive number')
    .integer('Population must be an integer')
    .min(0, 'Population cannot be negative')
    .max(10000000000, 'Population is unrealistically high')
    .required('Population is required'),
  cityIds: Yup.array().of(Yup.string().min(3, 'City name must be at least 3 characters').required('City name is required')).default([]),
});
