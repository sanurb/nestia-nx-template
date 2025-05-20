import { Catch } from '@nestjs/common'
import { ProblemError } from './problem_error'
import { BaseProblemFilter } from './base_problem.filter'

@Catch(ProblemError)
export class ProblemFilter extends BaseProblemFilter {
  getProblem(error: ProblemError) {
    return error.problem
  }
}