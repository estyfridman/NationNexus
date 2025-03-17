import {Formik, Form, ErrorMessage, Field} from 'formik';
import IconButton from '@mui/material/Button';
import {countrySchema} from '../../models/schemas/countrySchema';
import './countryForm.scss';
import {useNavigate, useParams} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {selectedCountryState} from '../../services/recoilService/selectedCountry';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useCreateCountry} from '../../services/hooks/useCountry';
import {useUpdateCountry} from '../../services/hooks/useCountry';
import {successAlert, errorAlert} from '../../utils/sweet-alerts';
import {RegionEnum} from '../../models/enums/RegionEnum';
import {initialCountry} from '../../utils/initialValues';
import {LABELS, BUTTON_TEXT, ALERT_MESSAGES} from '../../constants/constants';
import {userState} from '../../services/recoilService/userState';
import {useEffect} from 'react';
import {RoleEnum} from '../../models/enums/RoleEnum';

export default function CountryForm() {
  const {id} = useParams();
  const navigate = useNavigate();
  const selectedCountry = useRecoilValue(selectedCountryState);
  const {user} = useRecoilValue(userState);

  const createCountryMutation = useCreateCountry();
  const updateCountryMutation = useUpdateCountry();

  const isEditMode = !!id;
  const initialValues = isEditMode ? selectedCountry : initialCountry;

  const handleSubmit = (values: any) => {
    if (isEditMode) {
      updateCountryMutation.mutate(
        {
          id: id || selectedCountry._id || '',
          updatedData: values,
        },
        {
          onSuccess: () => {
            successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_UPDATE_COUNTRY_B);
            navigate('/');
          },
          onError: (error: any) => {
            errorAlert(error?.message || ALERT_MESSAGES.ERROR_UPDATE_COUNTRY);
          },
        }
      );
    } else {
      createCountryMutation.mutate(values, {
        onSuccess: () => {
          successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_CREATE_COUNTRY_B);
          navigate('/');
        },
        onError: (error: any) => {
          errorAlert(error?.message || ALERT_MESSAGES.ERROR_CREATE_COUNTRY);
        },
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (!user || user.role === RoleEnum.GUEST) {
        errorAlert(ALERT_MESSAGES.GUEST);
        navigate('/');
      }
      if (isEditMode && user!.role !== RoleEnum.ADMIN) {
        errorAlert(ALERT_MESSAGES.NO_ADMIN);
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <>
      <h2>{isEditMode ? LABELS.EDIT_COUNTRY : LABELS.ADD_COUNTRY}</h2>
      <Formik initialValues={initialValues} validationSchema={countrySchema} onSubmit={handleSubmit}>
        {({values, initialValues, dirty, isValid}) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form className='edit-form'>
              <div className='field-container'>
                <label htmlFor='name'>{LABELS.NAME}</label>
                <Field type='text' id='name' name='name' className='form-control' />
                <ErrorMessage name='name' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='flag'>{LABELS.FLAG_URL}</label>
                <Field type='text' id='flag' name='flag' className='form-control' />
                <ErrorMessage name='flag' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='region'>{LABELS.REGION}</label>
                <Field as='select' id='region' name='region' className='form-control'>
                  {Object.values(RegionEnum).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name='region' component='div' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor='population'>{LABELS.POPULATION}</label>
                <Field type='number' id='population' name='population' className='form-control' />
                <ErrorMessage name='population' component='div' className='error' />
              </div>

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
