import { isProduction } from 'std-env';

export const getLogLevel = (): string => {
  if (isProduction) {
    return process.env.LOG_LEVEL || 'info';
  }
  return 'debug';
};
