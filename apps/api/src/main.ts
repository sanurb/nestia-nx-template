/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrap } from '@sanurb/nestia-nx-template/infra-nest-server'
import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'api',
  port: 4444,
  enableVersioning: true,
  jsonBodyLimit: '350kb',
})
