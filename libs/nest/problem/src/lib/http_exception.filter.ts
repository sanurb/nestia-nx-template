import { Catch, HttpException } from '@nestjs/common'
import { BaseProblemFilter } from './base_problem.filter'
import { HttpProblem } from '@sanurb/nestia-nx-template/shared'
import { ProblemType } from '@sanurb/nestia-nx-template/shared'

type ErrorResponse = string | { message: string; error?: string }

@Catch(HttpException)
export class HttpExceptionFilter extends BaseProblemFilter {
  getProblem(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse() as ErrorResponse
    if (typeof response === 'string') {
      return {
        status,
        type: `https://httpstatuses.io/${status}` as typeof ProblemType[keyof typeof ProblemType],
        title: response,
      } as HttpProblem
    }
    return {
      status,
      type: `https://httpstatuses.io/${status}` as typeof ProblemType[keyof typeof ProblemType],
      title: response.error || response.message,
      detail: response.error ? response.message : undefined,
    } as HttpProblem
  }
}