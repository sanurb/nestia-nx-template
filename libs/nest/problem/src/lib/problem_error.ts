import { HttpException } from '@nestjs/common'
import { HttpProblem, Problem, problemSpecs, ProblemType } from '@sanurb/nestia-nx-template/shared'
import { isProduction } from 'std-env'

type HttpExceptionResponse = string | { message: string; error?: string }

export class ProblemError extends Error {
  constructor(public problem: Problem) {
    super(
      problem.detail ? `${problem.title} - ${problem.detail}` : problem.title,
    )
    Object.defineProperty(this, 'name', { value: 'ProblemError' })

    if (
      isProduction &&
      !problem.type.startsWith('http')
    ) {
      throw new Error('ProblemError type must be a URL.')
    }
  }

  static fromHttpException(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse() as HttpExceptionResponse
    let title, detail
    if (typeof response === 'string') {
      title = response
    } else {
      title = response.error || response.message
      detail = response.error ? response.message : undefined
    }

    const type = `https://httpstatuses.io/${status}` as ProblemType;
    return new ProblemError({
      type,
      status: problemSpecs[type]?.status ?? status,
      title,
      detail,
    } as Problem)
  }
}