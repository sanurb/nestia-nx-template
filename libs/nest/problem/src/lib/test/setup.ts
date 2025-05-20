/// <reference types="jest" />

import { Controller, Get, Module } from '@nestjs/common'
import request, { Test } from 'supertest'

import { testServer } from '@sanurb/nestia-nx-template/testing'
import { Logger, LOGGER_PROVIDER } from '@sanurb/nestia-nx-template/logging'

import { ProblemModule } from '../problem.module'
import { ProblemOptions } from '../problem.options'

export type CreateRequest = () => Test

export const setup = async (
  options: {
    problemOptions?: ProblemOptions
    handler?: () => void
    restRoute?: string
  } = {},
): Promise<[CreateRequest, jest.Mock, Logger, () => Promise<void>]> => {
  const handler = jest.fn().mockImplementation(options.handler)

  @Controller()
  class TestController {
    @Get(options?.restRoute)
    testHandler() {
      handler()
    }
  }

  @Module({
    imports: [
      options.problemOptions
        ? ProblemModule.forRoot(options.problemOptions)
        : ProblemModule,
    ],
    controllers: [TestController],
    providers: [],
  })
  class TestModule {}

  const app = await testServer({
    appModule: TestModule,
  })

  const teardown = async () => {
    await app.close()
  }

  return [
    () => request(app.getHttpServer()).get(options.restRoute || '/'),
    handler,
    app.get(LOGGER_PROVIDER) as Logger,
    teardown,
  ]
}
