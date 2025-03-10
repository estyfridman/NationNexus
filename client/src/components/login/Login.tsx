import {useFormik} from 'formik';
import {TextField, Button, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import logger from '../../utils/logger';
import {useLoginMutation} from '../../services/hooks/userMutations/useLoginMutation';
import {loginSchema} from '../../models/schemas/loginSchema';
import {initialLogin} from '../../utils/initialValues';
import {errorAlert} from '../../utils/sweet-alerts';
import {ALERT_MESSAGES, BUTTON_TEXT, FIELD, PATH} from '../../constants';

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const formik = useFormik({
    initialValues: initialLogin,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await loginMutation.mutateAsync(values);
        logger.info(`Login successful: ${values.username}`);
        navigate(PATH.ROOT);
      } catch (error) {
        errorAlert(ALERT_MESSAGES.USER_NOT_EXIST);
        navigate(PATH.REGISTER);
      }
    },
  });

  return (
    <Container component='main' maxWidth='xs'>
      <Typography variant='h5'>{BUTTON_TEXT.LOGIN}</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin='normal'
          id={FIELD.USERNAME}
          name={FIELD.USERNAME}
          label='User Name'
          type={FIELD.USERNAME}
          variant='outlined'
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          fullWidth
          margin='normal'
          id='password'
          name='password'
          label='Password'
          type='password'
          variant='outlined'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button color='primary' variant='contained' fullWidth type='submit'>
          {BUTTON_TEXT.LOGIN}
        </Button>
      </form>
    </Container>
  );
}
