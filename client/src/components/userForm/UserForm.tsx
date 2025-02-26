import {Formik, Form, ErrorMessage, Field} from 'formik';
import IconButton from '@mui/material/Button';
import RestrictedPermissionsCard from '../RestrictedPermissionsCard/RestrictedPermissionsCard';
import './userForm.scss';
import {useNavigate, useParams} from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useCreateUser, useUpdateUser} from '../../services/hooks/userHooks';
import {successAlert, errorAlert} from '../../utils/sweet-alerts';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {userSchema} from '../../models/schemas/userSchema';
import {initialUser} from '../../utils/initialValues';
import {useRecoilValue} from 'recoil';
import {userState} from '../../services/recoilService/userState';
import {useEffect, useState} from 'react';
import {selectedUserState} from '../../services/recoilService/selectedUserState';
import IUser from '../../models/interfaces/iUser';
import {ALERT_MESSAGES, BUTTON_TEXT, LABELS} from '../../../../shared/constants';

export default function UserForm() {
  const {id} = useParams();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);
  const selectedUser = useRecoilValue(selectedUserState);
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = !!id;
  const isEditingSelf = id === currentUser.user?._id;
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    if (currentUser.user?.role === RoleEnum.GUEST) {
      setHasPermission(false);
    }

    if (isEditMode) {
      if (isEditingSelf) {
        setUserToEdit(currentUser.user);
      } else if (selectedUser) {
        setUserToEdit(selectedUser);
      }
    }
  }, [id, currentUser, selectedUser]);

  const initialValues = isEditMode ? selectedUser || (id === currentUser.user?._id ? currentUser.user : initialUser) : initialUser;

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
            successAlert(ALERT_MESSAGES.SUCCESS, ALERT_MESSAGES.SUCCESS_UPDATE_USER);
            navigate('/');
          },
          onError: (error: any) => {
            errorAlert(error?.message || ALERT_MESSAGES.ERROR_UPDATE_USER);
          },
        }
      );
    } else {
      createUserMutation.mutate(formData, {
        onSuccess: () => {
          successAlert(ALERT_MESSAGES.SUCCESS, ALERT_MESSAGES.SUCCESS_CREATE_USER);
          navigate('/');
        },
        onError: (error: any) => {
          errorAlert(error?.message || ALERT_MESSAGES.ERROR_CREATE_USER);
        },
      });
    }
  };

  if (!hasPermission) {
    return <RestrictedPermissionsCard />;
  }

  return (
    <>
      <h2>{isEditMode ? LABELS.EDIT_USER : LABELS.CREATE_USER}</h2>

      <Formik initialValues={initialValues} validationSchema={userSchema} onSubmit={handleSubmit}>
        {({values, initialValues, dirty, isValid, handleSubmit, errors, touched, setFieldValue}) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form className='edit-form' onSubmit={handleSubmit}>
              <div className='field-container'>
                <label htmlFor='firstName'>{LABELS.FIRST_NAME}</label>
                <Field type='text' id='firstName' name='firstName' className='form-control' />
                <ErrorMessage name='firstName' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='lastName'>{LABELS.LAST_NAME}</label>
                <Field type='text' id='lastName' name='lastName' className='form-control' />
                <ErrorMessage name='lastName' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='username'>{LABELS.USER_NAME}</label>
                <Field type='text' id='username' name='username' className='form-control' />
                <ErrorMessage name='username' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='email'>{LABELS.EMAIL}</label>
                <Field type='email' id='email' name='email' className='form-control' />
                <ErrorMessage name='email' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='phone'>{LABELS.PHONE}</label>
                <Field type='tel' id='phone' name='phone' className='form-control' />
                <ErrorMessage name='phone' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='password'>{LABELS.PASSWORD}</label>
                <Field type='password' id='password' name='password' className='form-control' />
                <ErrorMessage name='password' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='profileImage'>{LABELS.PROFILE}</label>
                <input
                  type='file'
                  id='profileImage'
                  accept='image/*'
                  className='form-control'
                  onChange={(e: any) => setFieldValue('profileImage', e.target.files?.[0])}
                />
                <ErrorMessage name='profileImage' component='div' className='error' />
              </div>
              {currentUser && currentUser.user?.role === 'admin' && (
                <div className='field-container'>
                  <label htmlFor='role'>{LABELS.ROLE}</label>
                  <Field as='select' id='role' name='role' className='form-control'>
                    {Object.values(RoleEnum).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Field>
                  {touched.role && errors.role && <div className='error'>{errors.role}</div>}
                </div>
              )}

              <div className='buttons-container'>
                <IconButton type='submit' disabled={!dirty || !isValid || !hasChanged}>
                  <SaveIcon /> {isEditMode ? BUTTON_TEXT.UPDATE : BUTTON_TEXT.CREATE}
                </IconButton>

                <IconButton onClick={() => navigate('/')}>
                  <CancelIcon /> {BUTTON_TEXT.CANCEL}
                </IconButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
