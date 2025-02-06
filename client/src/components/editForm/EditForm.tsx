import { Formik, Form, ErrorMessage, Field } from 'formik';
import IconButton from '@mui/material/Button';
import { countrySchema } from '../../models/schemas/countrySchema';
import './editForm.scss';
import { useMutation } from '@tanstack/react-query';
import { cancelAlert, successAlert, errorAlert } from '../../utils/sweet-alerts';
import { useNavigate } from 'react-router-dom';
import { useUpdateCountry } from '../../services/hooks/useUpdateCountry';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const cancelEdit = () => {
  return Promise.resolve('Edit canceled');
};

export default function EditForm() {
  const { id } = useParams();
  const mutation = useMutation({ mutationFn: cancelEdit });
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
      <h1>Edit Country</h1>
      <Formik
        initialValues={selectedCountry}
        validationSchema={countrySchema}
        onSubmit={handleSubmit}
      >
        {({ values, initialValues, dirty, isValid }) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form>
              <div className="field-container">
                <label htmlFor="name"> Name</label>
                <Field name="name" type="text" id="name" />
                <ErrorMessage name="title" component="span" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="flag">Flag URL</label>
                <Field name="flag" type="text" id="flag" />
                <ErrorMessage name="flag" component="span" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="region">Region</label>
                <Field name="region" type="text" id="region" />
                <ErrorMessage name="region" component="span" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="population">Population</label>
                <Field name="population" type="number" id="population" />
                <ErrorMessage name="population" component="span" className="error" />
              </div>
              <IconButton
                className="edit-button"
                type="submit"
                disabled={!dirty || !isValid || !hasChanged}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                className="edit-button"
                type="button"
                disabled={!dirty || !hasChanged}
                onClick={() => cancelAlert(mutation.reset, navigate)}
              >
                <CancelIcon />
              </IconButton>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
