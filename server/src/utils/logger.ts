import winston from 'winston';
import {LEVELS, PATH} from '../constants';

const logFormat = winston.format.printf(({level, message, timestamp}) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: LEVELS.INFO,
  format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: PATH.ERR_LOG, level: LEVELS.ERROR}),
    new winston.transports.File({filename: PATH.COMB_LOG}),
  ],
});

export default logger;
