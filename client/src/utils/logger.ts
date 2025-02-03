import log from "loglevel";

log.setLevel("info");

const logger = {
  info: (message: string) => log.info(`[INFO]: ${message}`),
  warn: (message: string) => log.warn(`[WARN]: ${message}`),
  error: (message: string) => log.error(`[ERROR]: ${message}`),
  debug: (message: string) => log.debug(`[DEBUG]: ${message}`),
};

export default logger;