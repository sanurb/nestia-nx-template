import { createLogger, LoggerOptions } from 'winston';
import { getLogLevel } from './config/log_level';
import { getLogFormat } from './config/log_format';
import { getTransports } from './config/log_transports';

const loggerOptions: LoggerOptions = {
  level: getLogLevel(),
  format: getLogFormat(),
  transports: getTransports(),
  handleExceptions: true,
  exitOnError: true,
  exceptionHandlers: getTransports(),
  rejectionHandlers: getTransports(),
};

export const logger = createLogger(loggerOptions);
