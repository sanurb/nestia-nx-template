import { ProblemType, ValidationFailedFields } from "@sanurb/nestia-nx-template/shared";
import { ProblemError } from "./problem_error";


export class ValidationFailed extends ProblemError {
    constructor(fields: ValidationFailedFields) {
      super({
        type: ProblemType.VALIDATION_FAILED,
        title: 'Validation Failed',
        status: 400,
        detail: `Found issues in these fields: ${Object.keys(fields).join(', ')}`,
        fields,
      })
    }
  }