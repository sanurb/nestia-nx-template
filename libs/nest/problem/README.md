# nest/problem

This library implements standardized error handling for NestJS applications using [RFC 7807 Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807). It ensures that errors are returned in a consistent, machine-readable format, improving the developer experience for API consumers.

## Features

-   **RFC 7807 Compliance**: Formats HTTP error responses as `application/problem+json`.
-   **Global Exception Filters**: Automatically catches uncaught exceptions and transforms them into Problem Details. It provides the following global filters:
    -   `ErrorFilter`: Catches generic `Error` instances (and its subclasses that are not caught by other filters) and maps them to a 500 Internal Server Error problem.
    -   `HttpExceptionFilter`: Catches NestJS `HttpException` instances (e.g., `NotFoundException`, `BadRequestException`) and maps them to appropriate problem details, deriving the `type` URI from the HTTP status code (e.g., `https://httpstatuses.io/404`).
    -   `ProblemFilter`: Catches custom `ProblemError` instances, allowing services to throw errors that are already in the desired Problem Details format.
-   **Typed Problems**: Uses TypeScript types defined in the `libs/shared/problem` library to ensure consistency and provide strong typing for problem objects.
-   **Configurable Logging**: Integrates with the `logging` library to log server-side errors (5xx) and optionally all client errors (4xx) based on configuration.
-   **Easy Integration**: Provided as a NestJS `ProblemModule` that can be imported into your application's root module.

## Core Components

### `ProblemModule`

A NestJS module that registers the global exception filters. It should be imported into your main application module.

```typescript
// In your app.module.ts
import { Module } from '@nestjs/common';
import { ProblemModule } from '@sanurb/nestia-nx-template/nest/problem';
// ... other imports

@Module({
  imports: [
    ProblemModule, // Add ProblemModule here
    // ... other modules
  ],
  // ... controllers, providers
})
export class AppModule {}
```

The `ProblemModule.forRoot(options)` static method can be used to pass options, such as `logAllErrors: true` to enable logging for 4xx client errors.

### Exception Filters

-   **`ErrorFilter`**: Handles base `Error` types.
-   **`HttpExceptionFilter`**: Handles NestJS `HttpException` and its derivatives.
-   **`ProblemFilter`**: Handles `ProblemError` (a custom error type that wraps a `Problem` object).

These filters are applied globally when `ProblemModule` is imported.

### `ProblemError`

A custom error class (defined in `libs/nest/problem/src/lib/problem_error.ts`) that can be thrown by your application code if you need to specify the exact Problem Details.

Example:
```typescript
import { ProblemError } from '@sanurb/nestia-nx-template/nest/problem'; // Adjust path as per actual export
import { ProblemType } from '@sanurb/nestia-nx-template/shared/problem';

// ... in your service or controller
if (someCondition) {
  throw new ProblemError({
    type: ProblemType.HTTP_BAD_REQUEST, // Or any other ProblemType
    title: 'Invalid input provided.',
    status: 400,
    detail: 'The specific reason why the input was bad.',
    // You can add other custom properties here if defined in shared/problem
  });
}
```

## Dependencies

-   `libs/shared/problem`: For the TypeScript definitions of `Problem` objects.
-   `libs/logging`: For logging errors.

## Building

Run `nx build nest-problem` (or the actual project name if different, check `project.json`) to build the library.

## Running unit tests

Run `nx test nest-problem` (or the actual project name) to execute the unit tests via [Jest](https://jestjs.io).
