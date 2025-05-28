# shared-problem

This library defines the TypeScript types and structures for [RFC 7807 Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807). It ensures that error responses are consistently structured across different parts of the application and other libraries (like `nest/problem`).

## Features

-   **TypeScript Definitions**: Provides strongly-typed interfaces for `Problem` objects (e.g., `Problem`, `HttpProblem`, `ValidationFailedProblem`).
-   **Problem Types**: Defines canonical URIs for common problem types (e.g., `ProblemType.HTTP_NOT_FOUND`, `ProblemType.VALIDATION_FAILED`) in `src/lib/problem_types.ts`.
-   **Consistency**: By providing a shared definition of error structures, this library helps maintain consistency in how errors are represented and handled.
-   **Extensibility**: The types are designed to allow for additional, problem-specific properties via discriminated unions and mapped types (see `Extras<T>` in `problem.ts`).

## Core Definitions

-   **`Problem` (type)**: The main discriminated union type representing any valid problem detail object.
-   **`ProblemType` (const and type)**: An object and a type defining standard URIs for problem types (e.g., `https://httpstatuses.io/404` for Not Found).
-   **`BaseProblem` (interface)**: Defines common properties required by RFC 7807, such as `type`, `status`, `title`, and `detail`.

This library primarily exports TypeScript types and constants and does not contain significant runtime logic. It is a dependency for `libs/nest/problem` and any other part of the system that needs to work with Problem Details objects directly.

## Building

Run `nx build shared-problem` to build the library.

## Running unit tests

Run `nx test shared-problem` to execute the unit tests via [Jest](https://jestjs.io).
