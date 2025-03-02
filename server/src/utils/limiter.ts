import rateLimit from 'express-rate-limit';
import {MESSAGES} from '../constants';

export const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
  message: MESSAGES.RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
});
