import app from '../index'
import request from 'supertest'
import redis from '../lib/redis'

describe('Interview Start Test',()=>{
    it('should return 401',async ()=>{
        const res=await request(app).post('/interview/start');
        expect(res.status).toBe(401)
    })
})