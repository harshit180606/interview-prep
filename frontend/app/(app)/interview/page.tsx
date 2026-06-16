'use client'
import api from '@/lib/api'
import Link from 'next/link';
import { useState } from 'react'

export default function Interview() {
    const [state , setState]=useState<'setup' | 'active' | 'complete'>('setup');
    const [category , setCategory]=useState('');
    const [difficulty , setDifficulty]=useState('');
    const [questions , setQuestions]=useState<string[]>([]);
    const [answers , setAnswers]=useState<string[]>([]);
    const [currentAnswer , setCurrentAnswer]=useState('');
    const [feedback , setFeedback]=useState<string[]>([]);
    const [currentIndex , setCurrentIndex]=useState(0);
    const [score , setScore]=useState<number[]>([]);
    const [loading , setLoading]=useState(false);
    const [answered , setAnswered]=useState(false)
    const [finishing, setFinishing] = useState(false)

    const startInterview = async () => {
        if(!category || !difficulty) {
            alert('All fields are required')
            return;
        }
        setLoading(true);
        try{
            const res=await api.post('/interview/start' , {category , difficulty});
            setQuestions(res.data.questions);
            setState('active');
        }
        catch(err) {
            console.error('Error starting interview:', err);
        }
        finally {
            setLoading(false);
        }
    }

    const submitAnswer = async () => {
        if(!currentAnswer) {
            alert('Answer cannot be empty');
            return;
        }
        setLoading(true);
        try{
            const res=await api.post('/interview/evaluate' , {
                question: questions[currentIndex],
                answer: currentAnswer,
                category : category
            });
            const { score: qScore, feedback: qFeedback } = res.data;
            const newScore = [...score];
            newScore[currentIndex] = qScore;
            setScore(newScore);
            const newFeedback = [...feedback];
            newFeedback[currentIndex] = qFeedback;
            setFeedback(newFeedback);
            setAnswers(prev => {
                const updated = [...prev]
                updated[currentIndex] = currentAnswer
                return updated
            })
            setCurrentAnswer('');
            setAnswered(true);
        }
        catch(err) {
            console.error('Error submitting answer:', err);
        }
        finally {
            setLoading(false);
        }
    }

    const finishInterview = async () => {
        if(finishing) return  
        setFinishing(true)
        try {
            await api.post('/interview/save', {
            category,
            difficulty,
            questions,
            answers,
            feedback,
            scores: score
            })
            setState('complete')
        } catch(err) {
            console.error('Error saving interview:', err)
            setFinishing(false)  
        }
    }

    if(state === 'setup') return(
        <div className="min-h-screen bg-purple-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Start Interview</h1>
            <div className="flex flex-col gap-4">
                <select 
                className="text-gray-800 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                onChange={e => setCategory(e.target.value)}
                >
                <option value="">Select Category</option>
                <option value="DSA">DSA</option>
                <option value="System Design">System Design</option>
                <option value="HR">HR</option>
                <option value="ML">ML</option>
                </select>
                <select 
                className="text-gray-800 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400" 
                onChange={e => setDifficulty(e.target.value)}
                >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                </select>
                <button 
                onClick={startInterview} 
                className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                {loading ? 'Loading...' : 'Start Interview'}
                </button>
            </div>
            </div>
        </div>
    )

    else if(state === 'active') return(
        <div className="min-h-screen bg-purple-50 p-8">
            <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <span className="text-purple-600 font-semibold">Question {currentIndex + 1} of 5</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">{category} — {difficulty}</span>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow mb-4">
                <p className="text-lg font-semibold text-gray-800">{questions[currentIndex]}</p>
            </div>
            <textarea
                className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows={5}
                placeholder="Type your answer here..."
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
            />
            <button 
                onClick={submitAnswer} 
                disabled={answered || loading}
                className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? 'Evaluating...' : answered ? 'Answer Submitted' : 'Submit Answer'}
            </button>
            {feedback[currentIndex] && (
                <div className="mt-4 bg-white p-6 rounded-2xl shadow border-l-4 border-purple-500">
                    <p className="font-bold text-purple-700 mb-2">Feedback</p>
                    <p className="text-gray-700 mb-3">{feedback[currentIndex]}</p>
                    <p className="font-semibold text-gray-800">Score: {score[currentIndex]}/10</p>
                    <button 
                        onClick={() => {
                            if(currentIndex < 4) {
                            setCurrentIndex(currentIndex + 1)
                            setAnswered(false)
                            }
                            else finishInterview()
                        }}
                        disabled={finishing}
                        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {finishing ? 'Saving...' : currentIndex < 4 ? 'Next Question' : 'Finish Interview'}
                    </button>
                </div>
            )}
            </div>
        </div>
    )

    else return(
        <div className="min-h-screen bg-purple-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Interview Complete!</h2>
            <p className="text-gray-500 mb-6">Great job completing the interview.</p>
            <div className="bg-purple-50 p-6 rounded-xl mb-6">
                <p className="text-gray-500 mb-1">Your Average Score</p>
                <p className="text-5xl font-bold text-purple-600">
                {(score.reduce((a, b) => a + b, 0) / score.length).toFixed(1)}
                </p>
                <p className="text-gray-400 text-sm mt-1">out of 10</p>
            </div>
            <Link 
                href="/history" 
                className="block bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
                View Full History
            </Link>
            </div>
        </div>
    )
}