type ConsoleFn = (message: string, meta?: Record<string, unknown>) => void;

export const wrapConsoleLog = (
  logFn: ConsoleFn
): ((...args: unknown[]) => void) => {
  return function (...args: unknown[]) {
    const strings = args.filter((arg) => typeof arg === 'string');
    const objects = args.filter(
      (arg) => typeof arg === 'object' && arg !== null
    );
    const message = strings.join(' ');
    const extra =
      objects.length > 1 ? Object.assign({}, ...objects) : objects[0];
    logFn(message, extra);
  };
};
