import { FormikHelpers } from 'formik';

export type ResetFormType = FormikHelpers<any>['resetForm'];
export type NavigateType = (path: string) => void;
