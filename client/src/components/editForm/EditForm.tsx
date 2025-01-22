
import { Formik, Form, ErrorMessage, Field } from 'formik';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { countrySchema } from '../../models/countrySchema'
import './editForm.scss';
import { useMutation } from '@tanstack/react-query';
import { deleteAlert } from '../../utils/sweet-alerts';
import { useNavigate } from 'react-router-dom';
import { useUpdateCountry } from '../../services/hooks/countryQuery';
import { ICountry } from '../../models/iCountry';

const cancelEdit = () => {
    return Promise.resolve("Edit canceled");
  };

export default function EditForm() {
    const mutation = useMutation({ mutationFn: cancelEdit })
    const navigate = useNavigate();
    const updateCountryMutation = useUpdateCountry();

        const handleSubmit = () => {
            updateCountryMutation.mutate({
                 id: '1', 
                 updatedData: {name: 'Israel', flag: 'logo.svg'}
            })
            
        };
    return (
        <Formik initialValues={{
            name: '', //from react query
            flags: '',
            population: 10,
            region: '',
        }}  validationSchema={countrySchema}
            onSubmit={handleSubmit}>
            <Form>
                <div className="field-container">
                    <TextField> Name</TextField>
                    <Field name="name" type="text" id="name"/>
                    <ErrorMessage name="title" component="span" className="error" />
                </div>

                <div className="field-container">
            <label htmlFor="flags">Flag URL</label>
            <Field name="flags" type="text" id="flags" />
            <ErrorMessage name="flags" component="span" className="text-red-500" />
          </div>

          <div className="field-container">
            <label htmlFor="region">Region</label>
            <Field name="region" type="text" id="region" />
            <ErrorMessage name="region" component="span" className="text-red-500" />
          </div>

          <div className="field-container">
            <label htmlFor="population">Population</label>
            <Field name="population" type="number" id="population" />
            <ErrorMessage name="population" component="span" className="text-red-500" />
          </div>

                <Button type="submit" variant="contained" color="primary"> Save </Button>
                <Button type="button" variant="outlined" color="secondary" onClick={() => deleteAlert(mutation.reset, navigate)}> Cancel </Button>
            </Form>
        </Formik>
    )
}