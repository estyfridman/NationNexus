import * as Yup from 'yup';
import {VALID, ALERT_MESSAGES} from '../../constants';

export const citySchema = Yup.object().shape({
  name: Yup.string().min(2, ALERT_MESSAGES.MIN_LEN_NAME).max(40, ALERT_MESSAGES.MAX_LEN_NAME).required(ALERT_MESSAGES.REQUIRED_NAME),
  countryId: Yup.string()
    .required(VALID.COUNTRY_REQUIRED)
    .matches(/^[0-9a-fA-F]{24}$/, VALID.COUNTRY_INVALID),
});
