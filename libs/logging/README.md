# logging

This library provides a centralized and structured logging solution for the Nx monorepo, based on [Winston](https://github.com/winstonjs/winston). It offers NestJS integration and console patching to ensure consistent logging practices.

## Features

-   **Structured Logging**: Uses Winston to produce structured logs (typically JSON), which are easier to parse, search, and analyze in log management systems.
-   **Configurable Log Levels and Formats**: Log levels (e.g., info, warn, error) and output formats can be configured (details in `src/lib/config/`).
-   **NestJS Integration**:
    -   Provides a global `LoggingModule` that makes a configured Winston logger instance available for dependency injection within your NestJS application.
    -   Offers a `LoggingModule.createLogger()` static method that returns a `LoggerService` compatible with NestJS's built-in logging system. This is used by `infra-nest-server` during application bootstrapping.
-   **Console Patching**: Includes a `patchConsole()` utility that replaces the global `console.log()`, `console.warn()`, and `console.error()` functions. This ensures that messages logged via the standard console methods are also processed by the Winston logger, maintaining consistency.
-   **Exception and Rejection Handling**: Configured to automatically log uncaught exceptions and unhandled promise rejections.

## Core Components

### `logger`

The main Winston logger instance, pre-configured with formats, transports, and levels. It can be imported and used directly in parts of the application where dependency injection is not available or suitable.

```typescript
import { logger } from '@sanurb/nestia-nx-template/logging'; // Adjust path as per actual export

logger.info('This is an informational message.');
logger.error('This is an error message.', { error: new Error('Something went wrong') });
```

### `LoggingModule`

A global NestJS module. When imported into your `AppModule` (or similar root module), it provides the Winston logger instance via NestJS's dependency injection system. `infra-nest-server` handles this integration automatically.

To use it in a NestJS service or controller:
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston'; // Or your specific logger provider token
import { LOGGER_PROVIDER } from '@sanurb/nestia-nx-template/logging'; // Adjust path

@Injectable()
export class MyService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  doSomething() {
    this.logger.info('MyService is doing something.');
  }
}
```

### `patchConsole()`

A function that, when called (typically at application startup), redirects global `console.*` calls to the Winston logger. `infra-nest-server` calls this function during its bootstrap process.

## Configuration

The logger's behavior (level, format, transports) is primarily configured within the library itself, in the `src/lib/config/` directory. Environment variables might be used to influence these settings (e.g., `LOG_LEVEL`).

## Building

Run `nx build logging` (or the actual project name if different, check `project.json`) to build the library.

## Running unit tests

Run `nx test logging` (or the actual project name) to execute the unit tests via [Jest](https://jestjs.io).
