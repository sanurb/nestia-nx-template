# testing-nest

This library provides utilities to simplify the setup of NestJS applications for integration and end-to-end (E2E) testing environments.

## Features

-   **Simplified Test Server Creation**: Exports a `testServer` asynchronous function that streamlines the creation and configuration of a NestJS `INestApplication` instance tailored for testing.
-   **Integration with `infra-nest-server`**: It leverages `infra-nest-server` to ensure that test environments closely mirror the production setup, including common infrastructure like logging, metrics (optional), and health check stubs.
-   **Customizable Test Modules**: Allows overriding or extending module providers and controllers using the standard `@nestjs/testing` `TestingModuleBuilder` for fine-grained control over the test environment.
-   **Lifecycle Management**: The `testServer` function returns an application object augmented with a `cleanUp` method. This method ensures proper teardown of the application and any associated resources (e.g., hooks) after tests are complete, preventing resource leaks and interference between tests.
-   **Hooks**: Supports custom setup and teardown logic through a `hooks` mechanism, allowing for extension of the test application lifecycle.

## Core Function: `testServer(options: TestServerOptions)`

The main utility provided by this library.

-   `options`: An object of type `TestServerOptions`, allowing specification of:
    -   `appModule`: The root module of the NestJS application to be tested.
    -   `override`: A function to customize the `TestingModuleBuilder`.
    -   `hooks`: An array for custom setup/teardown logic.
    -   `enableVersioning`: Enables NestJS versioning for the test application.
    -   `healthCheck`: Configuration for health checks in the test environment.
    -   `beforeServerStart`: A hook to execute custom logic before the test server fully starts.

Example of creating a test server:
```typescript
// In your test setup file (e.g., some.e2e-spec.ts)
import { testServer, TestApp } from '@sanurb/nestia-nx-template/testing/nest'; // Adjust path
import { AppModule } from '../../src/app/app.module'; // Path to your app's module

describe('My Application', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      // Optional: override providers or controllers for testing
      // override: (builder) => builder.overrideProvider(MyService).useClass(MockMyService),
    });
    await app.init(); // Ensure the app is initialized
  });

  afterAll(async () => {
    await app.cleanUp(); // Gracefully shuts down the test application
  });

  it('should do something', async () => {
    // Your test logic using the 'app' instance (e.g., supertest request)
    // import request from 'supertest';
    // const response = await request(app.getHttpServer()).get('/');
    // expect(response.status).toBe(200);
  });
});
```

## Building

Run `nx build testing-nest` to build the library.

## Running unit tests

Run `nx test testing-nest` to execute the unit tests via [Jest](https://jestjs.io).
