import app from '../index';
import request from 'supertest'
import redis from '../lib/redis'

describe('Auth Test',()=>{
    it('should return 401',async ()=>{
        const res=await request(app).get('/user/me');
        expect(res.status).toBe(401)
    })
})
