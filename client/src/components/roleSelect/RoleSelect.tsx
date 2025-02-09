import { useFormikContext, ErrorMessage } from 'formik';
import { RoleEnum } from '../../models/enums/RoleEnum';

export default function RoleSelect() {
  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <div className="field-container">
      <label htmlFor="role">Role</label>
      <select
        id="role"
        name="role"
        className="form-control"
        value={values.role}
        onChange={(e) => setFieldValue('role', e.target.value)}
      >
        {Object.values(RoleEnum).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <ErrorMessage name="role" component="div" className="error" />
    </div>
  );
}
