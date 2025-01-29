import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useCreateCountry } from "../../services/hooks/useCreateCountry";
import { errorRegisterAlert, successAlert } from "../../utils/sweet-alerts";

interface AddCountryDialogProps {
    open: boolean;
    onClose: (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void;
  }
  

export default function AddCountryDialog({ open, onClose }: AddCountryDialogProps){
  const { mutate: createNewCountry } = useCreateCountry();
  const [formData, setFormData] = useState({
    name: "",
    flag: "",
    region: "",
    population: "",
  });

  const handleChange = (e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    createNewCountry(
      { ...formData, population: Number(formData.population) },
      {
        onSuccess: () => {
          successAlert("Country Added", "The country was added successfully!"); 
          onClose({}, "backdropClick"); 
        },
        onError: (error) => {
            errorRegisterAlert("There was an issue adding the country. Please try again.");
            console.error("Failed to add country:", error);
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
        <TextField label="Population" name="population" fullWidth onChange={handleChange} margin="dense" type="number" />
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};
