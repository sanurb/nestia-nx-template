import { INestApplication } from '@nestjs/common'
import { NestiaSwaggerComposer } from '@nestia/sdk'
import { NestiaEditorModule } from '@nestia/editor/lib/NestiaEditorModule'

export async function setupOpenApi(
  app: INestApplication,
  swaggerConfig: Omit<any, 'paths'>,
  swaggerPath = '/swagger',
): Promise<void> {
  const document = await NestiaSwaggerComposer.document(app, swaggerConfig)

  await NestiaEditorModule.setup({
    path: swaggerPath,
    application: app,
    swagger: document as any,
    package: 'Infra Backend',
    simulate: true,
    e2e: true,
  })
}
