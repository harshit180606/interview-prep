import express from 'express'
import prisma from '../lib/prisma'
import authMiddleware from '../middleware/auth'

const router = express.Router()
router.get('/me',authMiddleware,async(req,res)=>{
    try{
        const userId=(req as any).userId
        const user=await prisma.user.findUnique({
            where : {id : userId}
        })
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json({message:'Error fetching user'})
    }
})

export default router
