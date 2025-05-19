import { DynamicModule } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { LoggingModule } from '@sanurb/nestia-nx-template/logging'

import { HealthCheckOptions, HealthCheckOptionsProviderKey } from './types'
import { HealthLogger } from './health.logger'
import { HealthController } from './health.controller'

const defaultOptions: HealthCheckOptions = {
  timeout: 1000,
}

export class HealthModule {
  static register(options?: HealthCheckOptions): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [
        {
          // Make the health check options available for injection
          provide: HealthCheckOptionsProviderKey,
          useValue: {
            ...defaultOptions,
            ...options,
          } as HealthCheckOptions,
        },
        HealthLogger,
      ],
      imports: [
        TerminusModule.forRoot({
          logger: HealthLogger,
        }),
        LoggingModule,
      ],
    }
  }
}
