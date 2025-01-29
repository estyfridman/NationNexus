import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Avatar } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { successAlert } from "../../utils/sweet-alerts";

export default function Register() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      profileImage: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      username: Yup.string().min(3, "Too Short!").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().matches(/^\+?\d{10,14}$/, "Invalid phone number").required("Required"),
      password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);

      try {
        await axios.post("http://localhost:5000/api/register", formData);
        successAlert("Success", "Registration successful!");
      } catch (error) {
        console.error("Error registering:", error);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      formik.setFieldValue("profileImage", file);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="First Name" {...formik.getFieldProps("firstName")} error={formik.touched.firstName && Boolean(formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName} />
          <TextField label="Last Name" {...formik.getFieldProps("lastName")} error={formik.touched.lastName && Boolean(formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName} />
          <TextField label="Username" {...formik.getFieldProps("username")} error={formik.touched.username && Boolean(formik.errors.username)} helperText={formik.touched.username && formik.errors.username} />
          <TextField label="Email" type="email" {...formik.getFieldProps("email")} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} />
          <TextField label="Phone" {...formik.getFieldProps("phone")} error={formik.touched.phone && Boolean(formik.errors.phone)} helperText={formik.touched.phone && formik.errors.phone} />
          <TextField label="Password" type="password" {...formik.getFieldProps("password")} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />

          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={preview || ""} sx={{ width: 56, height: 56 }} />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Box>
      </form>
    </Container>
  );
}