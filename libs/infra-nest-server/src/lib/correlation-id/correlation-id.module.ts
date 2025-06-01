import { Module, DynamicModule } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { CorrelationIdInterceptor } from './correlation-id.interceptor';
import { CorrelationIdService } from './correlation-id.service';

@Module({})
export class CorrelationIdModule {
    public static forRoot(): DynamicModule {
        return {
            module: CorrelationIdModule,
            imports: [
                ClsModule.forRoot({
                    global: true,
                }),
            ],
            providers: [
                CorrelationIdService,
                {
                    provide: 'APP_INTERCEPTOR',
                    useClass: CorrelationIdInterceptor,
                },
            ],
            exports: [CorrelationIdService],
        };
    }
}
