# Nestia + Nx Monorepo

This project is a monorepo managed with [Nx](https://nx.dev/) for a NestJS backend application. It leverages [Nestia](https://nestia.io/) for generating typed API routes and SDKs, enhancing developer experience and type safety.

## Project Overview

The primary application is a NestJS API, demonstrating best practices for building scalable and maintainable backend services. The monorepo also includes several libraries that provide core functionalities like server bootstrapping, metrics, logging, standardized error handling, and testing utilities.

## Applications

### `apps/api`

This is the main NestJS application.
-   **Functionality**: Currently, it provides a basic "Hello API" endpoint (`/`). It serves as a demonstration of how to integrate and use the various libraries within this monorepo.
-   **Bootstrapping**: It is bootstrapped using the `infra-nest-server` library, which handles common setup tasks like logging, metrics, and health checks.
-   **Error Handling**: Utilizes the `nest/problem` library to provide standardized RFC 7807 Problem Details for error responses.

## Libraries

This monorepo contains the following libraries located in the `libs/` directory:

-   **`infra-metrics`**: Provides Prometheus metrics collection. It automatically collects default Node.js and system metrics and exposes them on a `/metrics` endpoint for monitoring.
-   **`infra-nest-server`**: A comprehensive solution for bootstrapping NestJS applications. Key features include:
    -   Simplified server setup via a `bootstrap` function.
    -   Integration with `infra-metrics` for metrics collection.
    -   Integration with the `logging` library for structured logging.
    -   Automatic setup of health check endpoints (`/liveness`, `/version`) and configurable detailed health checks via its `HealthModule`.
    -   OpenAPI (Swagger) specification generation using Nestia, including a Swagger UI editor.
    -   Configuration of common middleware.
-   **`logging`**: Implements Winston-based structured logging.
    -   Provides a NestJS `LoggingModule` for easy integration.
    -   Includes a `patchConsole` utility to ensure all console output is captured by the structured logger.
-   **`nest/problem`**: Standardizes error responses using [RFC 7807 Problem Details](https://tools.ietf.org/html/rfc7807).
    -   Includes global NestJS exception filters (`ErrorFilter`, `HttpExceptionFilter`, `ProblemFilter`) to automatically convert errors into Problem+JSON format.
    -   Uses `libs/shared/problem` for TypeScript type definitions of problem details.
-   **`shared/problem`**: Defines the TypeScript types and structures for Problem Details objects. This ensures consistency in error responses across the application and libraries.
-   **`testing/nest`**: Provides utilities for creating and managing NestJS test servers for integration and end-to-end testing.
    -   Integrates with `infra-nest-server` to ensure test environments closely mirror the production setup.

## Getting Started

### Prerequisites

-   Node.js (refer to `.nvmrc` or `package.json` engines for version)
-   npm or yarn

### Installation

1.  Clone the repository.
2.  Install dependencies: `npm install` or `yarn install`

### Running the Application

-   To start the main API in development mode:
    ```bash
    npx nx serve api
    ```
    The API will typically be available at `http://localhost:4444`.

### Building Applications and Libraries

-   To build a specific application or library (e.g., `api`):
    ```bash
    npx nx build api
    ```
    Or for a library (e.g., `infra-metrics`):
    ```bash
    npx nx build infra-metrics
    ```
    Build artifacts are stored in the `dist/` directory.

### Running Tests

-   To run tests for a specific application or library (e.g., `api`):
    ```bash
    npx nx test api
    ```
    Or for a library (e.g., `infra-metrics`):
    ```bash
    npx nx test infra-metrics
    ```
-   To run tests for all projects:
    ```bash
    npx nx run-many -t test
    ```

## Project Structure

-   **`apps/`**: Contains the main applications.
    -   `api/`: The primary NestJS application.
    -   `api-e2e/`: End-to-end tests for the `api` application.
-   **`libs/`**: Contains shared libraries used by applications or other libraries.
    -   Each library is a self-contained unit with its own source code, tests, and README.
-   **`tools/`**: (If it exists) May contain workspace-specific tooling, scripts, or generators.

## Nx Integration

This workspace utilizes [Nx](https://nx.dev) for monorepo management. Key Nx features used include:

-   **Task Running**: `nx run <project>:<target>` (e.g., `nx run api:serve`).
-   **Dependency Graph**: `npx nx graph` to visualize project dependencies.
-   **Caching**: Nx caches build and test results to speed up repeated operations.
-   **Code Generation**: Nx can be used to generate new applications, libraries, components, etc.

Refer to the [Nx documentation](https://nx.dev/getting-started/intro) for more information.

## Further Help

Visit the [Nx Documentation](https://nx.dev) to learn more.
You can also [connect with the Nx community](https://nx.dev/community).
