import { format } from 'winston';
import { utilities } from 'nest-winston';
import { includeContextFormatter } from '../context/async-context';
import { isProduction } from 'std-env';

export const getLogFormat = () => {
  if (isProduction) {
    return format.combine(
      format.errors({ stack: true }),
      format.timestamp(),
      includeContextFormatter(),
      format.json()
    );
  }

  return format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    utilities.format.nestLike('App')
  );
};
