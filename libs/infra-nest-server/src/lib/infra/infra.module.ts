import { DynamicModule, Module, Type } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingModule } from '@sanurb/nestia-nx-template/logging'

import { InfraController } from './infra.controller'
import { HealthModule } from './health/health.module'
import { HealthCheckOptions } from './health/types'

interface InfraModuleOptions {
  appModule: Type<unknown>
  healthCheck?: boolean | HealthCheckOptions
}

@Module({
  controllers: [InfraController],
  providers: [],
  imports: [LoggingModule],
})
export class InfraModule {
  static forRoot({
    appModule,
    healthCheck,
  }: InfraModuleOptions): DynamicModule {
    const defaultImports = [appModule]
    return {
      module: InfraModule,
      imports: [
        ...defaultImports,
        ...(healthCheck === false
          ? []
          : [
              HealthModule.register(
                healthCheck === true ? undefined : healthCheck,
              ),
            ]),
      ],
    }
  }
}
