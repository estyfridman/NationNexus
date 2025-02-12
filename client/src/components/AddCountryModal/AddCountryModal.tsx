import { useState, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useCreateCountry } from '../../services/hooks/useCreateCountry';
import { errorAlert, successAlert } from '../../utils/sweet-alerts';
import logger from '../../utils/logger';
import { initialCountry } from '../../utils/initialValues';

interface AddCountryDialogProps {
  open: boolean;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
}

export default function AddCountryDialog({ open, onClose }: AddCountryDialogProps) {
  const { mutate: createNewCountry } = useCreateCountry();
  const [formData, setFormData] = useState(initialCountry);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = () => {
    createNewCountry(
      { ...formData, population: Number(formData.population) },
      {
        onSuccess: () => {
          successAlert('Country Added', 'The country was added successfully!');
          onClose({}, 'backdropClick');
        },
        onError: (error) => {
          errorAlert('There was an issue adding the country. Please try again.');
          logger.error(`Failed to add country: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Country</DialogTitle>
      <DialogContent>
        <TextField label="Name" name="name" fullWidth onChange={handleChange} margin="dense" />
        <TextField label="Flag URL" name="flag" fullWidth onChange={handleChange} margin="dense" />
        <TextField label="Region" name="region" fullWidth onChange={handleChange} margin="dense" />
        <TextField
          label="Population"
          name="population"
          fullWidth
          onChange={handleChange}
          margin="dense"
          type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
