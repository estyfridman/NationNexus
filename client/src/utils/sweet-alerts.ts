import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import {ResetFormType, NavigateType} from '../models/swalTypes';
import {requestPermission} from '../services/userService';

export const successAlert = async (title?: string, text?: string) => {
  Swal.fire({
    title: title || 'Success',
    text: text || 'Your action was completed successfully',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
  });
};

export const errorAlert = async (message?: string) => {
  Swal.fire({
    title: 'error!',
    text: message || 'Something went wrong. Please try again later.',
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
};

export const errorDeleteAlert = async (message: string) => {
  Swal.fire({
    title: 'error!',
    text: message || 'Something went wrong. Please try again later.',
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
};

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

export const requestPermissionsAlert = async (navigate: NavigateType, userId: string) => {
  if (!userId) {
    navigate('/login');
    return;
  }
  const result = await Swal.fire({
    title: 'Request Permissions',
    text: 'Select the role you are requesting:',
    icon: 'question',
    input: 'select',
    inputOptions: {
      USER: 'User',
      ADMIN: 'Admin',
    },
    showCancelButton: true,
    confirmButtonText: 'Request',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    const requestedRole = result.value;
    try {
      await requestPermission(requestedRole, userId);
      Swal.fire('Success', 'Your request has been sent for approval.', 'success');
      navigate('/');
    } catch (error) {
      Swal.fire('Error', 'Failed to send request. Please try again later.', 'error');
    }
  }
};

export const genericErrorAlert = async () => {
  Swal.fire({
    title: 'error!',
    text: 'Something went wrong. Please try again later.',
    icon: 'error',
    timer: 2000,
    showConfirmButton: false,
  });
};
