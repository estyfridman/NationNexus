import {Formik, Form, ErrorMessage, Field} from 'formik';
import IconButton from '@mui/material/Button';
import RestrictedPermissionsCard from '../RestrictedPermissionsCard/RestrictedPermissionsCard';
import './userForm.scss';
import {useNavigate, useParams} from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useCreateUser, useUpdateUser} from '../../services/hooks/useUsers';
import {successAlert, errorAlert} from '../../utils/sweet-alerts';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {userSchema} from '../../models/schemas/userSchema';
import {initialUser} from '../../utils/initialValues';
import {useRecoilValue} from 'recoil';
import {userState} from '../../services/recoilService/userState';
import {useEffect, useState} from 'react';
import {selectedUserState} from '../../services/recoilService/selectedUserState';
import IUser from '../../models/interfaces/iUser';
import {ALERT_MESSAGES, BUTTON_TEXT, FIELD, LABELS} from '../../constants/constants';
import {PermissionEnum} from '../../models/enums/permissionEnum';

export default function UserForm() {
  const [newPassword, setNewPassword] = useState<string>('');
  const {id} = useParams();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userState);
  const selectedUser = useRecoilValue(selectedUserState);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isEditMode = !!id;
  const userToEdit = isEditMode ? selectedUser || currentUser.user : initialUser;
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    if (currentUser.user?.role === RoleEnum.ADMIN) {
      return;
    }
    if (isEditMode) {
      if (!currentUser.user?.permissions?.includes(PermissionEnum.EDIT)) {
        setHasPermission(false);
      }
    } else {
      // create user
      if (!currentUser.user?.permissions?.includes(PermissionEnum.ADD)) {
        setHasPermission(false);
      }
    }
  }, [id, currentUser, selectedUser]);

  const initialValues = userToEdit ? {...userToEdit} : initialUser;

  const userId = userToEdit && 'user' in userToEdit && userToEdit._id ? userToEdit._id : (userToEdit as IUser)?._id || id;

  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'profileImage' && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });

    if (isEditMode) {
      updateUserMutation.mutate(
        {
          id: userId || '',
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
      <h2 className='title'>{isEditMode ? LABELS.EDIT_USER : LABELS.CREATE_USER}</h2>

      <Formik initialValues={initialValues} validationSchema={userSchema} onSubmit={handleSubmit}>
        {({values, initialValues, dirty, isValid, handleSubmit, setFieldValue}) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form className='edit-form' onSubmit={handleSubmit} encType='multipart/form-data'>
              <div className='field-container'>
                <label htmlFor='firstName'>{LABELS.FIRST_NAME}</label>
                <Field type='text' id='firstName' name='firstName' />
                <ErrorMessage name='firstName' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='lastName'>{LABELS.LAST_NAME}</label>
                <Field type='text' id='lastName' name='lastName' />
                <ErrorMessage name='lastName' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='username'>{LABELS.USER_NAME}</label>
                <Field type='text' id='username' name='username' />
                <ErrorMessage name='username' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='email'>{LABELS.EMAIL}</label>
                <Field type='email' id='email' name='email' />
                <ErrorMessage name='email' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='phone'>{LABELS.PHONE}</label>
                <Field type='tel' id='phone' name='phone' />
                <ErrorMessage name='phone' component='div' className='error' />
              </div>

              {isEditMode ? (
                <div className='field-container'>
                  <label htmlFor={FIELD.PASSWORD}>{LABELS.PASSWORD}</label>
                  <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <ErrorMessage name={FIELD.PASSWORD} component='div' className='error' />
                </div>
              ) : (
                <div className='field-container'>
                  <label htmlFor={FIELD.PASSWORD}>{LABELS.PASSWORD}</label>
                  <Field type='password' id={FIELD.PASSWORD} name={FIELD.PASSWORD} />
                  <ErrorMessage name={FIELD.PASSWORD} component='div' className='error' />
                </div>
              )}

              <div className='field-container'>
                <label htmlFor='profileImage'>{LABELS.PROFILE}</label>
                <input
                  type='file'
                  id='profileImage'
                  accept='image/*'
                  className='form-control'
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    console.log(event?.currentTarget?.files ? [0] : '');
                    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                      setFieldValue('profileImage', event.currentTarget.files[0]);
                    }
                  }}
                />
                <ErrorMessage name='profileImage' component='div' className='error' />
              </div>
              {currentUser && currentUser.user?.role === RoleEnum.ADMIN && (
                <div className='field-container'>
                  <label htmlFor='role'>{LABELS.ROLE}</label>
                  <Field as='select' id='role' name='role' className='form-control'>
                    {Object.values(RoleEnum).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Field>
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
