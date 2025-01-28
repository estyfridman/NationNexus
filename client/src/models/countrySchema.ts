import * as Yup from 'yup';

export const countrySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  flag: Yup.string().url("Must be a valid URL").required("Flag URL is required"),
  region: Yup.string().required("Region is required"),
  population: Yup.number()
    .positive("Population must be a positive number")
    .integer("Population must be an integer")
    .required("Population is required")
});