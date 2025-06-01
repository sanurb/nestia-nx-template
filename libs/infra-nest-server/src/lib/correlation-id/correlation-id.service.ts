import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { REQUEST_ID_KEY, CORRELATION_ID_KEY } from './correlation-id.constants';

@Injectable()
export class CorrelationIdService {
    public constructor(private readonly cls: ClsService) { }

    /**
     * Generate a new request ID (UUIDv4).
     */
    public generateRequestId(): string {
        return crypto.randomUUID();
    }

    /**
     * Generate a new correlation ID (UUIDv4).
     */
    public generateCorrelationId(): string {
        return crypto.randomUUID();
    }

    /**
     * Bind both requestId and correlationId into CLS context, then run callback.
     */
    public runWithIds<T>(
        requestId: string,
        correlationId: string,
        callback: () => T,
    ): T {
        return this.cls.run(() => {
            this.cls.set(REQUEST_ID_KEY, requestId);
            this.cls.set(CORRELATION_ID_KEY, correlationId);
            return callback();
        });
    }

    /**
     * Retrieve the current request ID from CLS.
     * Throws if not set.
     */
    public getRequestId(): string {
        const id = this.cls.get<string>(REQUEST_ID_KEY);
        if (id === undefined) {
            throw new Error('Request ID not found in CLS context');
        }
        return id;
    }

    /**
     * Retrieve the current correlation ID from CLS.
     * Throws if not set.
     */
    public getCorrelationId(): string {
        const id = this.cls.get<string>(CORRELATION_ID_KEY);
        if (id === undefined) {
            throw new Error('Correlation ID not found in CLS context');
        }
        return id;
    }
}
