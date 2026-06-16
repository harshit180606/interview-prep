import 'dotenv/config'
import redis from '../lib/redis'

afterAll(async () => {
  await redis.quit()
})