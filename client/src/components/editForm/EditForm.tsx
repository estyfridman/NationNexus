import { Formik, Form, ErrorMessage, Field } from 'formik';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/Button';
import { countrySchema } from '../../models/countrySchema';
import './editForm.scss';
import { useMutation } from '@tanstack/react-query';
import { deleteAlert } from '../../utils/sweet-alerts';
import { useNavigate } from 'react-router-dom';
import { useUpdateCountry } from '../../services/hooks/countryQuery';
import { useParams } from 'react-router-dom';
import { client } from '../../api/client';
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

  const handleSubmit = () => {
    updateCountryMutation.mutate({
      id: '1',
      updatedData: { name: 'Israel', flag: 'logo.svg' }, //חייב לשנות כך שייקח את הנתונים שהכנסתי לטבלה
    });
  };

  return (
    <>
      <h1>Edit and Delete Country</h1>
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
                <label htmlFor="flags">Flag URL</label>
                <Field name="flags" type="file" id="flags" />
                <ErrorMessage name="flags" component="span" className="error" />
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
                type="submit"
                disabled={!dirty || !isValid || !hasChanged}
              >
                <SaveIcon/>
              </IconButton>
              <IconButton
                type="button"
                disabled={!dirty || !hasChanged}
                onClick={() => deleteAlert(mutation.reset, navigate)}
              >
                <CancelIcon/>
              </IconButton>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
