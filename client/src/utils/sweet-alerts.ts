import Swal from 'sweetalert2'
import "sweetalert2/src/sweetalert2.scss";
import { ResetFormType, NavigateType } from '../models/swalTypes';

export const successAlert = async (title?: string, text?: string) => {
  Swal.fire({
    title: title || "Success",
    text: text || "Your action was completed successfully",
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
}

export const errorAlert = async (message?: string) => {
  Swal.fire({
    title: "error!",
    text: message || "Something went wrong. Please try again later.",
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
}

export const errorDeleteAlert = async (message: string) => {
  Swal.fire({
    title: "error!",
    text: message || "Something went wrong. Please try again later.",
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
}

export const deleteAlert = async (onConfirm: () => void) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'No, cancel',
  });

  if (result.isConfirmed) {
    onConfirm();
  }
};

export const cancelAlert = async (resetForm: ResetFormType, navigate: NavigateType) => {
  const result = await Swal.fire({
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


export const genericErrorAlert = async () => {
  Swal.fire({
    title: "error!",
    text: "Something went wrong. Please try again later.",
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
}
