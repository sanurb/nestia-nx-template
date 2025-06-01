import { DynamicModule, Module, Type } from '@nestjs/common';
import { LoggingModule } from '@sanurb/nestia-nx-template/logging';
import { HealthModule } from './health/health.module';
import { HealthCheckOptions } from './health/types';
import { InfraController } from './infra.controller';

import { CorrelationIdModule } from '../correlation-id/correlation-id.module';

interface InfraModuleOptions {
    appModule: Type<unknown>;
    healthCheck?: boolean | HealthCheckOptions;
}

@Module({
    controllers: [InfraController],
    providers: [],
    imports: [LoggingModule],
})
export class InfraModule {
    public static forRoot({
        appModule,
        healthCheck,
    }: InfraModuleOptions): DynamicModule {
        const defaultImports: Array<Type<unknown> | DynamicModule> = [
            CorrelationIdModule.forRoot(),
            appModule,
        ];

        const healthImports =
            healthCheck === false
                ? []
                : [
                    HealthModule.register(
                        healthCheck === true ? undefined : healthCheck,
                    ),
                ];

        return {
            module: InfraModule,
            imports: [
                LoggingModule,
                ...defaultImports,
                ...healthImports,
            ],
        };
    }
}
