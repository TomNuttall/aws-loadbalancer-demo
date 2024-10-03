import 'jest'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import app from '../../src/app'

describe('route integration tests', () => {
  it('can get home route', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(StatusCodes.OK)
  })

  it('can get health route', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toEqual(StatusCodes.OK)
  })
})
