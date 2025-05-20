import { ArgumentsHost, ExceptionFilter, Inject } from '@nestjs/common'
import { Response } from 'express'

import { ProblemError } from './problem_error'
import { PROBLEM_OPTIONS } from './problem.options'
import type { ProblemOptions } from './problem.options'
import { Problem, ProblemType } from '@sanurb/nestia-nx-template/shared'
import { Logger, LOGGER_PROVIDER } from '@sanurb/nestia-nx-template/logging'

// Add a URL to this array to bypass the error filter and the ProblemJSON transformation
export const BYPASS_ERROR_FILTER_URLS = ['/health/check']

export abstract class BaseProblemFilter implements ExceptionFilter {

  constructor(
    @Inject(PROBLEM_OPTIONS)
    private readonly options: ProblemOptions,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
  }

  catch(error: Error, host: ArgumentsHost) {
    const problem = (error as ProblemError).problem || this.getProblem(error)

    if ((host.getType() as string) === 'graphql') {
      // this.catchGraphQLError(error, problem)
    } else {
      this.catchRestError(host, problem)
    }
  }

  // catchGraphQLError(error: Error, problem: Problem) {
  //   if (error instanceof ApolloError) {
  //     error.extensions.problem = error.extensions.problem || problem
  //     throw error
  //   } else {
  //     throw new ApolloError(problem.title, problem.type, { problem })
  //   }
  // }

  catchRestError(host: ArgumentsHost, problem: Problem) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // Logging logic
    if (problem.status && problem.status >= 500) {
      this.logger.error(new Error(problem.detail || response.statusMessage))
    } else if (this.options.logAllErrors && problem.status && problem.status < 500) {
      this.logger.info(new Error(problem.detail || response.statusMessage))
    }

    response.status(problem.status || 500)
    response.statusMessage = problem.title

    if (problem.type === ProblemType.HTTP_NO_CONTENT) {
      response.send()
    } else {
      response.setHeader('Content-Language', 'en')
      response.setHeader('Content-Type', 'application/problem+json')
      response.json(problem)
    }
  }

  abstract getProblem(error: Error): Problem
}