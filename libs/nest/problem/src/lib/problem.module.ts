import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './http_exception.filter'
import { ProblemFilter } from './problem.filter'
import { ErrorFilter } from './error.filter'
import { ProblemOptions, PROBLEM_OPTIONS } from './problem.options'
import { LoggingModule } from '@sanurb/nestia-nx-template/logging'

@Module({
  imports: [LoggingModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ProblemFilter,
    },
    {
      provide: PROBLEM_OPTIONS,
      useValue: { logAllErrors: false },
    },
  ],
})
export class ProblemModule {
  static forRoot(options: ProblemOptions) {
    return {
      module: ProblemModule,
      providers: [
        {
          provide: PROBLEM_OPTIONS,
          useValue: options,
        },
      ],
    }
  }
}