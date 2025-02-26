import {useState, useEffect} from 'react';
import ICity from '../../models/interfaces/iCity';
import {initialCity} from '../../utils/initialValues';
import {ModeEnum} from '../../models/enums/modeEnum';
import {errorAlert, successAlert} from '../../utils/sweet-alerts';
import {useCreateCity} from '../../services/hooks/cityMutations/useCreateCity';
import {useUpdateCity} from '../../services/hooks/cityMutations/useUpdateCity';
import {Formik, Form, ErrorMessage, Field, FormikState, FormikHelpers} from 'formik';
import {citySchema} from '../../models/schemas/citySchema';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useFetchCountries} from '../../services/hooks/useFetchCountries';
import {Autocomplete, TextField} from '@mui/material';
import {ICountry} from '../../models/interfaces/iCountry';
import './cityForm.scss';
import {ALERT_MESSAGES, LABELS, BUTTON_TEXT} from '../../../../shared/constants';
import {userState} from '../../services/recoilService/userState';
import {RoleEnum} from '../../../../shared/enums';
import {useRecoilValue} from 'recoil';
import {useNavigate} from 'react-router-dom';

interface CityFormProps {
  city: ICity | null;
  mode: ModeEnum;
  onClear: () => void;
}

export function CityForm({city, mode, onClear}: CityFormProps) {
  const [initialFormValues, setInitialFormValues] = useState<ICity>(initialCity);
  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();
  const {data: countries, isLoading, isError} = useFetchCountries();
  const {user} = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (city) {
      setInitialFormValues(city);
    } else {
      setInitialFormValues(initialCity);
    }
  }, [city, mode]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (!user || user.role === RoleEnum.GUEST) {
        errorAlert(ALERT_MESSAGES.GUEST);
        navigate('/');
      }
      if (mode === ModeEnum.EDIT && user!.role !== RoleEnum.ADMIN) {
        errorAlert(ALERT_MESSAGES.NO_ADMIN);
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = (values: ICity, {resetForm}: FormikHelpers<ICity>) => {
    if (mode === ModeEnum.CREATE) {
      const {_id, ...dataWithoutId} = values;
      createCityMutation.mutate(dataWithoutId, {
        onSuccess: () => {
          successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_CREATE_CITY);
          resetForm();
          onClear();
        },
        onError: (error: any) => {
          errorAlert(error?.message || ALERT_MESSAGES.ERROR_CREATE_CITY);
          resetForm();
        },
      });
    } else {
      updateCityMutation.mutate(
        {updatedData: values},
        {
          onSuccess: () => {
            successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_UPDATE_CITY);
            resetForm();
            onClear();
          },
          onError: (error: any) => {
            errorAlert(error?.message || ALERT_MESSAGES.ERROR_UPDATE_CITY);
            resetForm();
          },
        }
      );
    }
  };

  return (
    <Formik<ICity> initialValues={initialFormValues} validationSchema={citySchema} onSubmit={handleSubmit} enableReinitialize>
      {({values, initialValues, dirty, isValid, isSubmitting, setFieldValue, resetForm}) => (
        <Form>
          <div className='field-container'>
            <label htmlFor='name'>{LABELS.NAME}</label>
            <Field type='text' name='name' id='name' />
            <ErrorMessage name='name' component='div' className='error' />
          </div>
          <div className='field-container'>
            <label htmlFor='population'>{LABELS.POPULATION}</label>
            <Field type='number' name='population' id='population' />
            <ErrorMessage name='population' component='div' className='error' />
          </div>

          <div className='field-container'>
            <label htmlFor='countryId'>{LABELS.COUNTRY}</label>
            {isLoading ? (
              <div>{LABELS.LOADING}</div>
            ) : isError ? (
              <div>{LABELS.ERR_LOAD}</div>
            ) : countries ? (
              <Autocomplete
                options={countries}
                getOptionLabel={(option: ICountry) => option.name}
                getOptionKey={(option: ICountry) => option._id || Math.random()}
                value={countries.find((country) => country._id === values.countryId) || null}
                onChange={(event, newValue) => {
                  setFieldValue('countryId', newValue?._id || '');
                }}
                renderInput={(params) => <TextField {...params} label={LABELS.SELECT_COUNTRY} />}
              />
            ) : (
              <div>{LABELS.NO_COUNTRIES}</div>
            )}
            <ErrorMessage name='countryId' component='div' className='error' />
          </div>
          <button type='button' onClick={() => resetForm(initialValues as Partial<FormikState<ICity>>)}>
            {BUTTON_TEXT.RESET}
          </button>

          <IconButton type='submit' disabled={!dirty || !isValid || isSubmitting} size='large' color='success'>
            <SaveIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              resetForm();
              onClear();
            }}
            disabled={isSubmitting}
            size='large'
            color='info'>
            <CancelIcon />
          </IconButton>
        </Form>
      )}
    </Formik>
  );
}
