import * as Yup from 'yup';

export const citySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(40, 'Name must not exceed 40 characters')
    .required('Name is required'),
  population: Yup.number()
    .integer('Population must be a whole number')
    .positive('Population must be a positive number')
    .required('Population is required'),
  countryId: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')
    .required('Country is required'),
});
