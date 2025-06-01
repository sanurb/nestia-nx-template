import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CorrelationIdService } from './correlation-id.service';

export const RequestId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest<{
            correlationIdService: CorrelationIdService;
        }>();
        return request.correlationIdService.getRequestId();
    },
);

export const CorrelationId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest<{
            correlationIdService: CorrelationIdService;
        }>();
        return request.correlationIdService.getCorrelationId();
    },
);
