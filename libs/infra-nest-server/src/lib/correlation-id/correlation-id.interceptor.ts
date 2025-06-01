import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CorrelationIdService } from './correlation-id.service';
import type { Request, Response } from 'express';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
    public constructor(
        @Inject(CorrelationIdService)
        private readonly correlationIdService: CorrelationIdService,
    ) { }

    public intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const httpCtx = context.switchToHttp();
        const request = httpCtx.getRequest<Request>();
        const response = httpCtx.getResponse<Response>();

        // 1. Read or generate the Request-Id
        const incomingRequestId = (request.headers['x-request-id'] as
            | string
            | undefined);
        const requestId =
            incomingRequestId ?? this.correlationIdService.generateRequestId();

        // 2. Read or generate the X-Correlation-ID
        const incomingCorrelationId = (request.headers['x-correlation-id'] as
            | string
            | undefined);
        // If no incoming correlation ID, use requestId as fallback
        const correlationId =
            incomingCorrelationId ?? this.correlationIdService.generateCorrelationId();

        // 3. Attach both to response headers
        response.setHeader('X-Request-Id', requestId);
        response.setHeader('X-Correlation-Id', correlationId);

        // 4. Attach service instance to request for decorators
        ; (request as any).correlationIdService = this.correlationIdService;

        // 5. Run downstream in CLS context with both IDs
        return this.correlationIdService.runWithIds(requestId, correlationId, () =>
            next.handle().pipe(
                tap({
                    complete: (): void => {
                        // Optional: log using requestId & correlationId after response
                    },
                }),
            ),
        );
    }
}
