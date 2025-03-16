import {useState, useEffect} from 'react';
import ICity from '../../models/interfaces/iCity';
import {initialCity, initialCity2} from '../../utils/initialValues';
import {ModeEnum} from '../../models/enums/modeEnum';
import {errorAlert, successAlert} from '../../utils/sweet-alerts';
import {useCreateCity, useUpdateCity} from '../../services/hooks/useCountry';
import {Formik, Form, ErrorMessage, Field, FormikState, FormikHelpers} from 'formik';
import {citySchema} from '../../models/schemas/citySchema';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useFetchCountries} from '../../services/hooks/useCountry';
import {Autocomplete, TextField} from '@mui/material';
import {ICountry} from '../../models/interfaces/iCountry';
import './cityForm.scss';
import {ALERT_MESSAGES, LABELS, BUTTON_TEXT, ERRORS} from '../../constants';
import {userState} from '../../services/recoilService/userState';
import {useRecoilValue} from 'recoil';
import {useNavigate} from 'react-router-dom';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface CityFormProps {
  city: ICity | null;
  mode: ModeEnum;
  countryId: string | undefined;
  onClear: () => void;
  setCities: React.Dispatch<React.SetStateAction<ICity[]>>;
}

interface ICityFormValues {
  name: string;
  countryId: string;
}

export function CityForm({city, mode, countryId, onClear, setCities}: CityFormProps) {
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

  // useEffect(() => {
  //   if (!user) {
  //     navigate(PATH.LOGIN);
  //   } else if (mode === ModeEnum.EDIT && user?.permissions?.includes(PermissionEnum.EDIT)) {
  //     errorAlert(ALERT_MESSAGES.NO_ADMIN);
  //     navigate(PATH.ROOT);
  //   } else {
  //     errorAlert(ALERT_MESSAGES.GUEST);
  //     navigate(PATH.ROOT);
  //   }
  // }, [user, navigate]);

  const handleSubmit = (values: ICityFormValues, {resetForm}: FormikHelpers<ICityFormValues>) => {
    const selectedCountryId = countryId || values.countryId;

    if (!selectedCountryId) {
      errorAlert(ERRORS.GET_COUNTRY_NF_ERR);
      return;
    }

    if (mode === ModeEnum.CREATE) {
      createCityMutation.mutate(
        {city_name: values.name, countryId: selectedCountryId},
        {
          onSuccess: () => {
            successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_CREATE_CITY);
            resetForm();
            onClear();
            setCities((prevCities) => (city ? [...prevCities, city] : prevCities));
          },
          onError: (error: any) => {
            errorAlert(error?.message || ALERT_MESSAGES.ERROR_CREATE_CITY);
            resetForm();
          },
        }
      );
    } else {
      updateCityMutation.mutate(
        // להוסיף גם פה COUNTRY ID?
        {updatedData: values},
        {
          onSuccess: ({updatedData}) => {
            successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_UPDATE_CITY);
            resetForm();
            onClear();
            setCities((prevCities) => prevCities.map((city) => (city._id === updatedData._id ? {...city, ...updatedData} : city)));
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
    <Formik initialValues={initialCity2} validationSchema={citySchema} onSubmit={handleSubmit} enableReinitialize>
      {({values, initialValues, dirty, isValid, isSubmitting, setFieldValue, resetForm}) => (
        <Form className='city-form'>
          <div className='field-container'>
            <label htmlFor='name'>{LABELS.NAME}</label>
            <Field type='text' name='name' id='name' />
            <ErrorMessage name='name' component='div' className='error' />
          </div>
          {countryId ? (
            <h6>{countryId ? countries?.find((country) => country._id === countryId)?.name : ' '}</h6>
          ) : (
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
          )}

          <div className='icons-container'>
            <IconButton type='button' onClick={() => resetForm({values: initialValues})}>
              <RestartAltIcon />
            </IconButton>

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
          </div>
        </Form>
      )}
    </Formik>
  );
}
