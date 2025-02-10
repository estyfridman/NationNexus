import { Formik, Form, ErrorMessage, Field } from 'formik';
import IconButton from '@mui/material/Button';
import './userForm.scss';
import { useNavigate, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCreateUser, useUpdateUser } from '../../services/hooks/userHooks';
import { successAlert, errorAlert } from '../../utils/sweet-alerts';
import { RoleEnum } from '../../models/enums/RoleEnum';
import { userSchema } from '../../models/schemas/userSchema';
import { initialUser } from '../../utils/initialValues';
import { useSelectedUser } from '../../services/hooks/userMutations/userQueries';
import { useRecoilValue } from 'recoil';
import { userState } from '../../services/recoilService/userState';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = !!id;
  const { data: selectedUser } = useSelectedUser(id, isEditMode);

  const initialValues = isEditMode
    ? {
        firstName: selectedUser?.firstName || '',
        lastName: selectedUser?.lastName || '',
        username: selectedUser?.username || '',
        email: selectedUser?.email || '',
        phone: selectedUser?.phone || '',
        password: selectedUser?.password || '',
        profileImage: selectedUser?.profileImage || '',
        role: selectedUser?.role || '',
        createdAt: selectedUser?.createdAt,
      }
    : initialUser;

  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'profileImage' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    if (isEditMode) {
      updateUserMutation.mutate(
        {
          id: selectedUser?._id || id || '',
          formData,
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
      createUserMutation.mutate(formData, {
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
        {({
          values,
          initialValues,
          dirty,
          isValid,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
        }) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form className="edit-form" onSubmit={handleSubmit}>
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
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="form-control"
                  onChange={(e: any) => setFieldValue('profileImage', e.target.files?.[0])}
                />
                <ErrorMessage name="profileImage" component="div" className="error" />
              </div>
              {currentUser && currentUser.user?.role === 'admin' && (
                <div className="field-container">
                  <label htmlFor="role">Role</label>
                  <Field as="select" id="role" name="role" className="form-control">
                    {Object.values(RoleEnum).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Field>
                  {touched.role && errors.role && <div className="error">{errors.role}</div>}
                </div>
              )}

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
