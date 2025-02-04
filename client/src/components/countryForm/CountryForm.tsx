import { Formik, Form, ErrorMessage, Field } from 'formik';
import IconButton from '@mui/material/Button';
import { countrySchema } from '../../models/countrySchema';
import './countryForm.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useCreateCountry } from '../../services/hooks/useCreateCountry';
import { useUpdateCountry } from '../../services/hooks/useUpdateCountry';
import { successAlert, errorAlert } from '../../utils/sweet-alerts';
import { RegionEnum } from '../../models/enums/RegionEnum';

export default function CountryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedCountry = useRecoilValue(selectedCountryState);
  
  const createCountryMutation = useCreateCountry();
  const updateCountryMutation = useUpdateCountry();

  const isEditMode = !!id;

  const initialValues = isEditMode ? {
    name: selectedCountry?.name || '',
    flag: selectedCountry?.flag || '',
    region: selectedCountry?.region || '',
    population: selectedCountry?.population || 0
  } : {
    name: '',
    flagUrl: '',
    region: '',
    population: 0
  };

  const handleSubmit = (values: any) => {
    if (isEditMode) {
      updateCountryMutation.mutate(
        {
          id: id || selectedCountry._id || '',
          updatedData: values
        },
        {
          onSuccess: () => {
            successAlert("Success", "Country updated successfully!");
            navigate('/');
          },
          onError: (error: any) => {
            errorAlert(error?.message || "Failed to update country.");
          }
        }
      );
    } else {
      createCountryMutation.mutate(
        values,
        {
          onSuccess: () => {
            successAlert("Success", "Country created successfully!");
            navigate('/');
          },
          onError: (error: any) => {
            errorAlert(error?.message || "Failed to create country.");
          }
        }
      );
    }
  };

  return (
    <>
      <h2>{isEditMode ? 'Edit Country' : 'Create New Country'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={countrySchema}
        onSubmit={handleSubmit}
      >
        {({ values, initialValues, dirty, isValid }) => {
          const hasChanged = JSON.stringify(values) !== JSON.stringify(initialValues);
          return (
            <Form className="edit-form">
              <div className="field-container">
                <label htmlFor="name">Name</label>
                <Field type="text" id="name" name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="flag">Flag Url</label>
                <Field type="text" id="flag" name="flag" className="form-control" />
                <ErrorMessage name="flag" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="region">Region</label>
                <Field as="select" id="region" name="region" className="form-control">
                  {Object.values(RegionEnum).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="region" component="div" className="error" />
              </div>

              <div className="field-container">
                <label htmlFor="population">Population</label>
                <Field type="number" id="population" name="population" className="form-control" />
                <ErrorMessage name="population" component="div" className="error" />
              </div>

              <div className="buttons-container">
                <IconButton
                  type="submit"
                  disabled={!dirty || !isValid || !hasChanged}>
                  <SaveIcon /> {isEditMode ? 'Update' : 'Create'}
                </IconButton>
                
                <IconButton
                  onClick={() => navigate('/')}>
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