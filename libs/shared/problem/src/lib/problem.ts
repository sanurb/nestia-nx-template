/**
 * @fileoverview
 * Derives a discriminated Problem union from ProblemType & problemSpecs.
 */

import type { BaseProblem } from './base_problem'
import { problemSpecs } from './problem_specs'
import { ProblemType } from './problem_types'

/**
 * CoreProblem ties a BaseProblem to a specific ProblemType key,
 * enforcing the correct 'status' and requiring 'detail'.
 */
export type CoreProblem<T extends ProblemType> = BaseProblem & {
  readonly type: T
  readonly status: (typeof problemSpecs)[T]['status']
  readonly detail: string
}

/**
 * Extras allows per-type extension.  If you need e.g. `errors` on
 * VALIDATION_FAILED, add it here.
 */
type Extras<T extends ProblemType> =
  T extends typeof ProblemType.VALIDATION_FAILED
    ? { readonly errors: ReadonlyArray<{ field: string; message: string }> }
    : {}

export interface HttpProblem extends BaseProblem {
  type:
    | typeof ProblemType.HTTP_NO_CONTENT
    | typeof ProblemType.HTTP_BAD_REQUEST
    | typeof ProblemType.HTTP_UNAUTHORIZED
    | typeof ProblemType.HTTP_FORBIDDEN
    | typeof ProblemType.HTTP_NOT_FOUND
}

export interface HttpInternalServerErrorProblem extends BaseProblem {
    type: typeof ProblemType.HTTP_INTERNAL_SERVER_ERROR
    stack?: string
  }

/**
 * Our one true Problem union.  Exhaustive over all ProblemType entries.
 * Adding a new ProblemType + problemSpecs entry automatically flows into here.
 */
export type Problem = {
    [P in ProblemType]: CoreProblem<P> & Extras<P>
  }[ProblemType]
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem

export type ValidationFailedFields = {
    [key: string]: string | ValidationFailedFields
}

export interface ValidationFailedProblem extends BaseProblem {
    type: typeof ProblemType.VALIDATION_FAILED
    fields: ValidationFailedFields
  }


// Should be avoided whenever possible in favour of typed problems.
export interface UnknownProblem extends BaseProblem {
    [key: string]: unknown
}