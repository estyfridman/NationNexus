import React, { useState, useEffect } from 'react';
import ICity from '../../models/interfaces/iCity';
import { initialCity } from '../../utils/initialValues';
import { ModeEnum } from '../../models/enums/modeEnum';
import { errorAlert, successAlert } from '../../utils/sweet-alerts';
import { useCreateCity } from '../../services/hooks/cityMutations/useCreateCity';
import { useUpdateCity } from '../../services/hooks/cityMutations/useUpdateCity';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { citySchema } from '../../models/schemas/citySchema';

interface CityFormProps {
  city: ICity | null;
  mode: ModeEnum;
  onSave: () => void;
  onCancel: () => void;
}

export function CityForm({ city, mode, onSave, onCancel }: CityFormProps) {
  const [formData, setFormData] = useState<ICity>(initialCity);
  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();

  useEffect(() => {
    if (city) {
      setFormData(city);
    } else {
      setFormData(initialCity);
    }
  }, [city, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === ModeEnum.CREATE) {
      createCityMutation.mutate(formData, {
        onSuccess: () => {
          successAlert('Success', 'City created successfully!');
          onSave();
        },
        onError: (error: any) => {
          errorAlert(error?.message || 'Failed to create city.');
        },
      });
    } else {
      // ModeEnum.EDIT
      updateCityMutation.mutate(
        {
          id: city?._id || '',
          updatedData: formData,
        },
        {
          onSuccess: () => {
            successAlert('Success', 'City updated successfully!');
            onSave();
          },
          onError: (error: any) => {
            errorAlert(error?.message || 'Failed to update city.');
          },
        }
      );
    }
  };

  return (
    <>
      <h2>{mode === ModeEnum.EDIT ? 'Edit User' : 'Create New User'}</h2>
      <Formik
        initialValues={initialCity}
        validationSchema={citySchema}
        onSubmit={handleSubmit}
      ></Formik>
      <form onSubmit={handleSubmit}>
        {/* Input fields for city details */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {/* ... other input fields */}

        <button type="submit">{mode === ModeEnum.CREATE ? 'Create' : 'Edit'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </>
  );
}
