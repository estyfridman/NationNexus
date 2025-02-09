import * as Yup from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const userSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'FirstName must be at least 2 characters long')
    .max(40, 'FirstName must not exceed 40 characters')
    .required('FirstName is required'),
  lastName: Yup.string()
    .min(2, 'LastName must be at least 2 characters long')
    .max(40, 'LastName must not exceed 40 characters')
    .required('LastName is required'),
  username: Yup.string()
    .min(2, 'Username must be at least 2 characters long')
    .max(40, 'Username must not exceed 40 characters')
    .required('Username is required'),
  email: Yup.string().email('Must be a valid email address').required('Email is required'),
  phone: Yup.string()
    .matches(phoneRegExp, 'Must be a valid phone number')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  profileImage: Yup.mixed().nullable().notRequired(),
  role: Yup.string().oneOf(['admin', 'user', 'guest'], 'Invalid role').nullable().notRequired(),
  createdAt: Yup.date()
    .default(() => new Date())
    .notRequired(),
});
