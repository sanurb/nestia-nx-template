import core from '@nestia/core'
import { Controller, ServiceUnavailableException } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus'

/**
 * Health endpoint controller.
 *
 * @tag health
 * @summary Application health checks
 */
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  /**
   * Performs configured health checks (e.g., database ping).
   *
   * @returns The health check result
   */
  @core.TypedRoute.Get('check')
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    const result = await this.health.check([])

    if (result.status !== 'ok') {
      throw new ServiceUnavailableException(result)
    }

    return result
  }
}
