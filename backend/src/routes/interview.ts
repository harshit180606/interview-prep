import express from 'express';
import { generateQuestions , evaluateAnswer} from '../services/gemini';
import prisma from '../lib/prisma';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/start', authMiddleware, async (req, res) => {
    const { category, difficulty } = req.body
    if (!category || !difficulty) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const questions = await generateQuestions(category, difficulty)
        return res.status(200).json({ questions })
    } 
    catch (error) {
        console.error('Error generating questions:', error)
        return res.status(500).json({ message: 'Error generating questions' })
    }
});

router.post('/evaluate', authMiddleware, async (req, res) => {
    const { question, answer, category } = req.body
    if (!question || !answer || !category) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const { score, feedback } = await evaluateAnswer(question, answer, category)
        return res.status(200).json({ score, feedback })
    } 
    catch (error) {
        return res.status(500).json({ message: 'Error evaluating answer' })
    }
});

router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { category, difficulty, questions, answers, feedback, scores } = req.body
    const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length

    const interview = await prisma.interview.create({
      data: {
        userId: (req as any).userId,
        category,
        difficulty,
        questions,
        answers,
        feedback,
        score: avgScore
      }
    })
    res.status(201).json(interview)
  } catch(error) {
    console.error('Error saving interview:', error)
    res.status(500).json({ message: 'Failed to save interview' })
  }
})

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: { userId: (req as any).userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        category: true,
        difficulty: true,
        score: true,
        createdAt: true
      }
    })
    res.status(200).json(interviews)
  } catch(error) {
    res.status(500).json({ message: 'Failed to fetch history' })
  }
})

router.get('/history/:id', authMiddleware, async (req, res) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { 
        id: parseInt(req.params.id as string),
        userId: (req as any).userId
      }
    })
    if(!interview) return res.status(404).json({ message: 'Interview not found' })
    res.status(200).json(interview)
  } catch(error) {
    res.status(500).json({ message: 'Failed to fetch interview' })
  }
})

router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string)
    const userId = (req as any).userId

    const interview = await prisma.interview.findUnique({
      where: { id }
    })

    if(!interview) return res.status(404).json({ message: 'Interview not found' })
    if(interview.userId !== userId) return res.status(403).json({ message: 'Unauthorized' })

    await prisma.interview.delete({ where: { id } })
    res.status(200).json({ message: 'Interview deleted' })
  } 
  catch(error) {
    res.status(500).json({ message: 'Failed to delete interview' })
  }
})

export default router;