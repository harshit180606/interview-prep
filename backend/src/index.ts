import express from 'express'
import cors from 'cors'
import './config/passport'
import passport from 'passport'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import interviewRoutes from './routes/interview'

const port: number = 5000

const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(passport.initialize())

app.use('/auth', authRoutes)
app.use('/user', userRoutes) 
app.use('/interview', interviewRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'API is running' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})