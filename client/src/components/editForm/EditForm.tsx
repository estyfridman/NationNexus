import {Formik, Form, ErrorMessage, Field} from 'formik';
import IconButton from '@mui/material/Button';
import {countrySchema} from '../../models/schemas/countrySchema';
import './editForm.scss';
import {useMutation} from '@tanstack/react-query';
import {cancelAlert, successAlert, errorAlert} from '../../utils/sweet-alerts';
import {useNavigate} from 'react-router-dom';
import {useUpdateCountry} from '../../services/hooks/useCountry';
import {useParams} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {selectedCountryState} from '../../services/recoilService/selectedCountry';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {FIELD, LABELS} from '../../constants';

const cancelEdit = () => {
  return Promise.resolve('Edit canceled');
};

export default function EditForm() {
  const {id} = useParams();
  const mutation = useMutation({mutationFn: cancelEdit});
  const navigate = useNavigate();
  const selectedCountry = useRecoilValue(selectedCountryState);

  const updateCountryMutation = useUpdateCountry();

  const handleSubmit = (values: any) => {
    updateCountryMutation.mutate(
      {
        id: id || selectedCountry._id || '',
        updatedData: values,
      },
      {
        onSuccess: () => {
          successAlert('Success', 'Country updated successfully!');
          navigate('/');
        },
        onError: (error: any) => {
          errorAlert(error?.message || 'Failed to update country.');
        },
      }
    );
    navigate('/');
  };

  return (
    <>
      <h1>{LABELS.EDIT_COUNTRY}</h1>
      <Formik initialValues={selectedCountry} validationSchema={countrySchema} onSubmit={handleSubmit}>
        {({values, initialValues, dirty, isValid}) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form>
              <div className='field-container'>
                <label htmlFor={FIELD.NAME}>{LABELS.NAME}</label>
                <Field name={FIELD.NAME} type='text' id={FIELD.NAME} />
                <ErrorMessage name={FIELD.NAME} component='span' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor={FIELD.FLAG}>{LABELS.FLAG_URL}</label>
                <Field name={FIELD.FLAG} type='text' id={FIELD.FLAG} />
                <ErrorMessage name={FIELD.FLAG} component='span' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor={FIELD.REGION}>{LABELS.REGION}</label>
                <Field name={FIELD.REGION} type='text' id={FIELD.REGION} />
                <ErrorMessage name={FIELD.REGION} component='span' className='error' />
              </div>

              <div className='field-container'>
                <label htmlFor={FIELD.POPULATION}>{LABELS.POPULATION}</label>
                <Field name={FIELD.POPULATION} type='number' id={FIELD.POPULATION} />
                <ErrorMessage name={FIELD.POPULATION} component='span' className='error' />
              </div>
              <IconButton className='edit-button' type='submit' disabled={!dirty || !isValid || !hasChanged}>
                <SaveIcon />
              </IconButton>
              <IconButton
                className='edit-button'
                type='button'
                disabled={!dirty || !hasChanged}
                onClick={() => cancelAlert(mutation.reset, navigate)}>
                <CancelIcon />
              </IconButton>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
