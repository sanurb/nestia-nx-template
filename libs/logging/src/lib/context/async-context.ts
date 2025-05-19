import { AsyncLocalStorage } from 'node:async_hooks';
import { format } from 'winston';

const loggingContextStorage = new AsyncLocalStorage<Record<string, unknown>>();

export const withLoggingContext = <R, TArgs extends unknown[]>(
  context: Record<string, unknown>,
  callback: (...args: TArgs) => R,
  ...args: TArgs
): R => {
  const mergedContext = {
    ...loggingContextStorage.getStore(),
    ...context,
  };
  return loggingContextStorage.run(mergedContext, callback, ...args);
};

export const includeContextFormatter = format((info) => {
  const store = loggingContextStorage.getStore();
  const codeOwner = process.env.CODE_OWNER;
  if (codeOwner) {
    info.codeOwner = codeOwner;
  }
  if (store) {
    Object.assign(info, store);
  }
  return info;
});
