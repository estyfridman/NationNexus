import { Formik, Form, ErrorMessage, Field } from 'formik';
import IconButton from '@mui/material/Button';
import './userForm.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../../services/recoilService/userState';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCreateUser, useUpdateUser } from '../../services/hooks/userHooks';
import { successAlert, errorAlert } from '../../utils/sweet-alerts';
import { RoleEnum } from '../../models/enums/RoleEnum';
import { userSchema } from '../../models/schemas/userSchema';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedUser = useRecoilValue(userState);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = !!id;

  const initialValues = isEditMode
    ? {
        firstName: selectedUser?.user.firstName || '',
        lastName: selectedUser?.user.lastName || '',
        username: selectedUser?.user.username || '',
        email: selectedUser?.user.email || '',
        phone: selectedUser?.user.phone || '',
        password: selectedUser?.user.password || '',
        profileImage: '', // שמירת הקובץ תיעשה בנפרד
        role: selectedUser?.user.role || '',
        createdAt: selectedUser?.user.createdAt,
      }
    : {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        profileImage: '',
        role: '',
        createdAt: new Date(),
      };

  const handleSubmit = (values: any) => {
    console.log(JSON.stringify(values));
    if (isEditMode) {
      updateUserMutation.mutate(
        {
          id: id || selectedUser.user._id || '',
          updatedData: values,
        },
        {
          onSuccess: () => {
            successAlert('Success', 'User updated successfully!');
            navigate('/');
          },
          onError: (error: any) => {
            errorAlert(error?.message || 'Failed to update user.');
          },
        }
      );
    } else {
      createUserMutation.mutate(values, {
        onSuccess: () => {
          successAlert('Success', 'User created successfully!');
          navigate('/');
        },
        onError: (error: any) => {
          errorAlert(error?.message || 'Failed to create user.');
        },
      });
    }
  };

  return (
    <>
      <h2>{isEditMode ? 'Edit User' : 'Create New User'}</h2>
      <Formik initialValues={initialValues} validationSchema={userSchema} onSubmit={handleSubmit}>
        {({ values, initialValues, dirty, isValid }) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form className="edit-form">
              <div className="field-container">
                <label htmlFor="firstName">First Name</label>
                <Field type="text" id="firstName" name="firstName" className="form-control" />
                <ErrorMessage name="firstName" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="lastName">Last Name</label>
                <Field type="text" id="lastName" name="lastName" className="form-control" />
                <ErrorMessage name="lastName" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="username">Username</label>
                <Field type="text" id="username" name="username" className="form-control" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="phone">Phone</label>
                <Field type="tel" id="phone" name="phone" className="form-control" />
                <ErrorMessage name="phone" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="profileImage">Profile Image</label>
                <Field type="file" id="profileImage" name="profileImage" className="form-control" />
              </div>

              <div className="field-container">
                <label htmlFor="role">Role</label>
                <Field as="select" id="role" name="role" className="form-control">
                  {Object.values(RoleEnum).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="div" className="error" />
              </div>

              <div className="buttons-container">
                <IconButton type="submit" disabled={!dirty || !isValid || !hasChanged}>
                  <SaveIcon /> {isEditMode ? 'Update' : 'Create'}
                </IconButton>

                <IconButton onClick={() => navigate('/')}>
                  <CancelIcon /> Cancel
                </IconButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
