# infra-nest-server

This library provides a comprehensive and opinionated solution for bootstrapping NestJS applications within the Nx monorepo. It handles common setup tasks, integrates essential infrastructure components, and promotes consistency across different services.

## Features

-   **Simplified Bootstrapping**: Offers a `bootstrap` function that initializes and configures a NestJS application with sensible defaults.
    -   The `bootstrap` function accepts `RunServerOptions` to customize server behavior, including port, global prefix, versioning, CORS, and more.
-   **Metrics Integration**: Automatically integrates with the `infra-metrics` library to collect and expose Prometheus-compatible metrics.
-   **Structured Logging**: Integrates with the `logging` library to provide structured, Winston-based logging throughout the application.
-   **OpenAPI (Swagger) Generation**: Leverages `@nestia/sdk` and `@nestia/editor` to generate an OpenAPI v3 specification and serve a Swagger UI editor. This is configured via the `openApi` option in `RunServerOptions`.
-   **Infrastructure Endpoints**: Includes an `InfraModule` that provides common utility endpoints:
    -   `/liveness`: A simple liveness probe endpoint (returns `HTTP 200 OK` with `{ "ok": true }`).
    -   `/version`: An endpoint to retrieve the application version (reads from the `REVISION` environment variable, defaults to "N/A").
-   **Health Checks**: Supports configurable health checks through its `HealthModule`. This allows applications to define and expose detailed health status for various dependencies (e.g., database, external services).
-   **Common Middleware**: Pre-configures essential middleware like `cookieParser` and `bodyParser`.
-   **Graceful Shutdown**: The `bootstrap` function returns a server object with a `close()` method for gracefully shutting down the application and its metric server.

## Core Components

### `bootstrap(options: RunServerOptions): Promise<InfraNestServer>`

This is the primary function exported by the library. It creates, configures, and starts a NestJS application.

-   `options`: An object of type `RunServerOptions` (defined in `libs/infra-nest-server/src/lib/types.ts`) that allows customization of:
    -   `appModule`: The root module of your NestJS application.
    -   `name`: The name of the service.
    -   `port`: The port to listen on.
    -   `openApi`: Configuration for Nestia Swagger.
    -   `enableVersioning`: Enables URI-based API versioning.
    -   `healthCheck`: Options for configuring health checks.
    -   And many other settings.
-   Returns: A promise that resolves to an `InfraNestServer` object, which contains the NestJS application instance, the HTTP server, the metrics server (if enabled), and a `close` method.

### `InfraModule`

A NestJS module that provides the `/liveness` and `/version` endpoints. It's typically imported into the main application module via `InfraModule.forRoot(...)` within the `bootstrap` process.

### `HealthModule`

A NestJS module that can be used to configure and expose detailed health check information. It's often integrated via the `healthCheck` options in `RunServerOptions`.

## Usage Example

The `apps/api` application in this monorepo serves as a practical example of how to use `infra-nest-server`. Key aspects from `apps/api/src/main.ts`:

```typescript
import { bootstrap } from '@sanurb/nestia-nx-template/infra-nest-server';
import { AppModule } from './app/app.module';

async function main() {
  await bootstrap({
    appModule: AppModule,
    name: 'api', // Service name
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4444,
    enableVersioning: true,
    jsonBodyLimit: '350kb', // Example: setting a JSON body limit
    // OpenAPI configuration would go here if needed
    // openApi: { ... },
  });
}

main();
```

## Building

Run `nx build infra-nest-server` to build the library.

## Running unit tests

Run `nx test infra-nest-server` to execute the unit tests via [Jest](https://jestjs.io).
