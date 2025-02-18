import { useState, useEffect } from 'react';
import ICity from '../../models/interfaces/iCity';
import { initialCity } from '../../utils/initialValues';
import { ModeEnum } from '../../models/enums/modeEnum';
import { errorAlert, successAlert } from '../../utils/sweet-alerts';
import { useCreateCity } from '../../services/hooks/cityMutations/useCreateCity';
import { useUpdateCity } from '../../services/hooks/cityMutations/useUpdateCity';
import { Formik, Form, ErrorMessage, Field, FormikState, FormikHelpers } from 'formik';
import { citySchema } from '../../models/schemas/citySchema';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFetchCountries } from '../../services/hooks/useFetchCountries';
import { Autocomplete, TextField } from '@mui/material';
import { ICountry } from '../../models/interfaces/iCountry';
import './cityForm.scss';

interface CityFormProps {
  city: ICity | null;
  mode: ModeEnum;
  onClear: () => void;
}

export function CityForm({ city, mode, onClear }: CityFormProps) {
  const [initialFormValues, setInitialFormValues] = useState<ICity>(initialCity);
  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();
  const { data: countries, isLoading, isError } = useFetchCountries();

  useEffect(() => {
    if (city) {
      setInitialFormValues(city);
    } else {
      setInitialFormValues(initialCity);
    }
  }, [city, mode]);

  const handleSubmit = (values: ICity, { resetForm }: FormikHelpers<ICity>) => {
    if (mode === ModeEnum.CREATE) {
      const { _id, ...dataWithoutId } = values;

      console.log(JSON.stringify(dataWithoutId));

      createCityMutation.mutate(dataWithoutId, {
        onSuccess: () => {
          successAlert('Success', 'City created successfully!');
          resetForm();
          onClear();
        },
        onError: (error: any) => {
          errorAlert(error?.message || 'Failed to create city.');
          resetForm();
        },
      });
    } else {
      updateCityMutation.mutate(
        { updatedData: values },
        {
          onSuccess: () => {
            successAlert('Success', 'City updated successfully!');
            resetForm();
            onClear();
          },
          onError: (error: any) => {
            errorAlert(error?.message || 'Failed to update city.');
            resetForm();
          },
        }
      );
    }
  };

  return (
    <Formik<ICity>
      initialValues={city || initialCity}
      validationSchema={citySchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, initialValues, dirty, isValid, isSubmitting, setFieldValue, resetForm }) => (
        <Form>
          <div className="field-container">
            <label htmlFor="name">Name</label>
            <Field type="text" name="name" id="name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div className="field-container">
            <label htmlFor="population">Population</label>
            <Field type="number" name="population" id="population" />
            <ErrorMessage name="population" component="div" className="error" />
          </div>

          <div className="field-container">
            <label htmlFor="countryId">Country</label>
            {isLoading ? (
              <div>Loading countries...</div>
            ) : isError ? (
              <div>Error loading countries.</div>
            ) : countries ? (
              <Autocomplete
                options={countries}
                getOptionLabel={(option: ICountry) => option.name}
                getOptionKey={(option: ICountry) => option._id || Math.random()}
                value={countries.find((country) => country._id === values.countryId) || null}
                onChange={(event, newValue) => {
                  setFieldValue('countryId', newValue?._id || '');
                }}
                renderInput={(params) => <TextField {...params} label="Select a country" />}
              />
            ) : (
              <div>No countries available.</div>
            )}
            <ErrorMessage name="countryId" component="div" className="error" />
          </div>
          <button
            type="button"
            onClick={() => resetForm(initialValues as Partial<FormikState<ICity>>)}
          >
            Reset
          </button>

          <IconButton
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
            size="large"
            color="success"
          >
            <SaveIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              resetForm();
              onClear();
            }}
            disabled={isSubmitting}
            size="large"
            color="info"
          >
            <CancelIcon />
          </IconButton>
        </Form>
      )}
    </Formik>
  );
}
