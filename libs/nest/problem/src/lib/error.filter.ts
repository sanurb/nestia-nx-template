import { Catch } from '@nestjs/common'
import { Problem, ProblemType } from '@sanurb/nestia-nx-template/shared'
import { BaseProblemFilter } from './base_problem.filter'
import { isProduction } from 'std-env'

@Catch(Error)
export class ErrorFilter extends BaseProblemFilter {
  getProblem(error: Error): Problem {
    const extraDetails =
      isProduction
        ? { detail: error.message, stack: error.stack }
        : null

    return {
      status: 500,
      type: ProblemType.HTTP_INTERNAL_SERVER_ERROR,
      title: 'Internal server error',
      ...extraDetails,
    }
  }
}