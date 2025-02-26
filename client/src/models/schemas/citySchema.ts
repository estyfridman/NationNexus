import * as Yup from 'yup';

export const citySchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters long').max(40, 'Name must not exceed 40 characters').required('Name is required'),
});
