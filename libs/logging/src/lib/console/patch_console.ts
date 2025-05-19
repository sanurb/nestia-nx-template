import { logger } from '../logging';
import { wrapConsoleLog } from './wrap_console_log';

export const patchConsole = (): void => {
  // NextJS internally uses console functions directly, eg on error. It's also
  // rare to load a logging library in react code.
  console.log = wrapConsoleLog(logger.info.bind(logger));
  console.warn = wrapConsoleLog(logger.warn.bind(logger));
  console.error = wrapConsoleLog(logger.error.bind(logger));
};
