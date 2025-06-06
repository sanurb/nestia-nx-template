import { ForbiddenException } from '@nestjs/common'

import { CreateRequest, setup } from './test/setup'
import { NoContentException } from './no_content_exception'

describe('HttpExceptionFilter', () => {
  let request: CreateRequest
  let handler: jest.Mock

  beforeAll(async () => {
    ;[request, handler] = await setup({
      handler: () => {
        throw new ForbiddenException()
      },
    })
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
        "status": 403,
        "title": "Forbidden",
        "type": "https://httpstatuses.io/403",
      }
    `)
  })

  it('includes custom message', async () => {
    // Arrange
    handler.mockImplementationOnce(() => {
      throw new ForbiddenException('Custom error')
    })

    // Act
    const response = await request()

    // Assert
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    )
    expect(response.body).toMatchInlineSnapshot(`
      {
        "detail": "Custom error",
        "status": 403,
        "title": "Forbidden",
        "type": "https://httpstatuses.io/403",
      }
    `)
  })


  it('returns 204 and empty body for NoContentException', async () => {
    // Arrange
    handler.mockImplementationOnce(() => {
      throw new NoContentException()
    })

    // Act
    const response = await request()

    // Assert
    expect(response.status).toBe(204)
    expect(response.body).toStrictEqual({})
  })
})