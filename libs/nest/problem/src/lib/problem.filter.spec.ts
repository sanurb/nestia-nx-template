import { ValidationFailed } from './validation_failed'
import { CreateRequest, setup } from './test/setup'

const handler = () => {
  throw new ValidationFailed({ field: 'error' })
}

describe('ProblemFilter', () => {
  let request: CreateRequest
  let teardown: () => Promise<void>
  beforeAll(async () => {
    ;[request, , , teardown] = await setup({ handler })
  })

  afterAll(async () => {
    await teardown()
  })

  it('returns valid problem response', async () => {
    // Act
    const response = await request()

    // Assert
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    )
    expect(response.body).toMatchInlineSnapshot(`
      {
        "detail": "Found issues in these fields: field",
        "fields": {
          "field": "error",
        },
        "status": 400,
        "title": "Validation Failed",
        "type": "https://httpstatuses.io/422",
      }
    `)
  })
})