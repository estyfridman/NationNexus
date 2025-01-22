"use client"
import Swal from 'sweetalert2'
import "sweetalert2/src/sweetalert2.scss";
import { ResetFormType, NavigateType } from '../models/swalTypes';

export const successAlert = async (title: string, text: string) => {
  Swal({
    title: title || "Success",
    text: text || "Your action was completed successfully",
    type: 'success',
    timer: 2000,
    showConfirmButton: false
  });
}

export const errorRegisterAlert = async (message: string) => {
  Swal({
    title: "error!",
    text: message || "Something went wrong. Please try again later.",
    type: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
}

export const deleteAlert = async (resetForm: ResetFormType, navigate: NavigateType) => {
  const result = await Swal({
    title: 'Are you sure?',
    text: 'Do you really want to cancel? Your changes will be lost.',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel',
    cancelButtonText: 'Stay on this page',
  });

  if (result.isConfirmed) {
    resetForm();
    navigate('/');
  }
};