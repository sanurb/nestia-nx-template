import { Controller } from '@nestjs/common'
import { TypedRoute } from '@nestia/core'
import { Liveness } from './entities/liveness.entity'
import { Version } from './entities/version.entity'

/**
 * @tag internal
 */
@Controller()
export class InfraController {
  /**
   * @tag internal
   * @summary Liveness probe
   * @returns Liveness payload
   */
  @TypedRoute.Get('liveness')
  public liveness(): Liveness {
    return { ok: true }
  }

  /**
   * @tag internal
   * @summary Version info
   * @returns Version payload
   */
  @TypedRoute.Get('version')
  public version(): Version {
    return { version: process.env.REVISION ?? 'N/A' }
  }
}
