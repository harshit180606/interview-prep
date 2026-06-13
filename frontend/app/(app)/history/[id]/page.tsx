'use client'
import api from "@/lib/api";
import { use , useState , useEffect} from "react";

interface Interview {
  id: number
  category: string
  difficulty: string
  score: number
  createdAt: string
  questions: string[]
  answers: string[]
  feedback: string[]
}

export default function InterviewDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [interview, setInterview] = useState<Interview | null>(null);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const res = await api.get(`/interview/history/${id}`);
                setInterview(res.data);
            } catch (error) {
                console.error('Error fetching interview details:', error);
            }
        };
        fetchInterview();
    }, [id]);
    if(!interview) return <p>Loading...</p>
    return (
        <div className="min-h-screen bg-purple-50 p-8">
            <div className="max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h1 className="text-2xl font-bold text-purple-700 mb-2">Interview Details</h1>
                <div className="flex gap-6 text-gray-600">
                <p>Category: <span className="font-semibold text-gray-800">{interview.category}</span></p>
                <p>Difficulty: <span className="font-semibold text-gray-800">{interview.difficulty}</span></p>
                <p>Score: <span className="font-semibold text-purple-600">{interview.score}/10</span></p>
                <p>Date: <span className="font-semibold text-gray-800">{new Date(interview.createdAt).toLocaleString()}</span></p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {interview.questions.map((q: string, index: number) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow">
                    <p className="font-bold text-purple-700 mb-2">Q{index + 1}: {q}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Your Answer:</span> {interview.answers[index]}</p>
                    <p className="text-gray-700"><span className="font-semibold">Feedback:</span> {interview.feedback[index]}</p>
                </div>
                ))}
            </div>
            </div>
        </div>
    )
}