import { Server } from 'http'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { NestFactory } from '@nestjs/core'
import { INestApplication, VersioningType } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

import {
  getServerPort,
  startMetricServer,
} from '@sanurb/nestia-nx-template/infra-metrics'
import {
  logger,
  LoggingModule,
  patchConsole as monkeyPatchServerLogging,
} from '@sanurb/nestia-nx-template/logging'

import { httpRequestDurationMiddleware } from './http_request_duration_middleware'
import { InfraModule } from './infra/infra.module'
import { InfraNestServer, RunServerOptions } from './types'

// Allow client connections to stay connected for up to 30 seconds of inactivity. For reference, the default value in
// Node.JS is 5 seconds, Kestrel (.NET) is 120 seconds and Nginx is 75 seconds.
const KEEP_ALIVE_TIMEOUT: number = 30_000

/**
 * Creates and configures a NestExpressApplication instance.
 */
export async function createApp({
  appModule,
  enableVersioning,
  healthCheck,
  beforeAppInit,
  globalPrefix,
  enableCors,
  collectMetrics = true,
  jsonBodyLimit,
}: RunServerOptions): Promise<NestExpressApplication> {
  if (beforeAppInit) {
    await beforeAppInit()
  }

  monkeyPatchServerLogging()

  const app = await NestFactory.create<NestExpressApplication>(
    InfraModule.forRoot({ appModule, healthCheck }),
    { logger: LoggingModule.createLogger() },
  )

  if (enableVersioning) {
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    })
  }

  if (enableCors) app.enableCors(enableCors)

  app.set('trust proxy', JSON.parse(process.env['EXPRESS_TRUST_PROXY'] ?? 'false'))

  if (globalPrefix) app.setGlobalPrefix(globalPrefix)
  if (collectMetrics) app.use(httpRequestDurationMiddleware())

  app.use(cookieParser())
  if (jsonBodyLimit) app.use(bodyParser.json({ limit: jsonBodyLimit }))

  return app
}

/**
 * Starts the HTTP server on the specified port.
 */
export async function startServer(
  app: INestApplication,
  port: number,
): Promise<Server> {
  const server = await app.listen(port)

  logger.info(
    `Service listening at http://localhost:${getServerPort(server, port)}`,
    { context: 'Bootstrap' },
  )

  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT
  return server
}

/**
 * Bootstraps the Nest server with given options.
 */
export async function bootstrap(
  options: RunServerOptions,
): Promise<InfraNestServer> {
  const app = await createApp(options)

  if (options.openApi) {
    const { setupOpenApi } = await import('./swagger-setup')
    await setupOpenApi(app, options.openApi, options.swaggerPath)
  }

  if (options.interceptors) {
    for (const interceptor of options.interceptors) {
      app.useGlobalInterceptors(interceptor)
    }
  }

  if (options.beforeServerStart) options.beforeServerStart(app)

  const port =
    process.env['PORT'] !== undefined
      ? Number(process.env['PORT'])
      : options.port ?? 3333
  const metricPort = port === 0 ? 0 : port + 1

  const server = await startServer(app, port)
  const metricsServer =
    options.collectMetrics !== false
      ? await startMetricServer(metricPort)
      : undefined

  return {
    app,
    server,
    metricsServer,
    close: async (): Promise<void> => {
      await app.close()
      if (metricsServer) {
        await new Promise<void>((resolve) =>
          metricsServer.close(() => resolve()),
        )
      }
    },
  }
}
