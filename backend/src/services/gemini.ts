import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function generateQuestions(
  category: string,
  difficulty: string
): Promise<string[]> {
  const prompt = `Generate 5 interview questions for a ${difficulty} level.Make questions unique and varied. 
  Cover different topics within ${category} interview.
  Return ONLY a JSON array of strings, no explanation, no markdown.
  Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]`

  console.log('Gemini API Key loaded:', !!process.env.GEMINI_API_KEY)
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  category: string
): Promise<{ score: number, feedback: string }> {
  const prompt = `You are an expert ${category} interviewer.
  Question: ${question}
  Candidate's Answer: ${answer}
  
  Evaluate this answer and return ONLY a JSON object like this:
  {"score": 8, "feedback": "Your explanation here"}
  Score should be between 0-10. No markdown, no explanation.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}