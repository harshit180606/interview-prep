import request from 'supertest'
import app from '../index'
import redis from '../lib/redis'

describe('Health Check', () => {
  it('should return 200 and message', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('API is running')
  })
})
