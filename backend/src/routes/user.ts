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

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId
    const interviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    const totalInterviews = interviews.length
    const avgScore = totalInterviews > 0
      ? interviews.reduce((sum, i) => sum + i.score, 0) / totalInterviews
      : 0

    const recentInterviews = interviews.slice(0, 3)

    res.status(200).json({
      totalInterviews,
      avgScore: Math.round(avgScore * 10) / 10,
      recentInterviews
    })
  } catch(error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data' })
  }
})

export default router
