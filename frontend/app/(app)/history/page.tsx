'use client'
import { use, useEffect, useState } from "react"
import api from "@/lib/api"
import Link from "next/link"

export default function History() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading , setLoading]=useState(true);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
            const res = await api.get('/interview/history')
            setInterviews(res.data)
            } 
            catch(error) {
            console.error('Error fetching interview history:', error)
            }
            finally{
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/interview/history/${id}`)
            setInterviews(interviews.filter((item: any) => item.id !== id))
        } 
        catch(err) {
            console.error('Error deleting interview:', err)
        }
    }

    if(loading) return <p className="text-lg">Loading...</p>
    else if(interviews.length === 0) return(
        <div className="p-8 text-center">
            <h2 className="p-8 text-gray-600 text-xl">No interview history found.</h2>
            <Link href="/interview" className="text-purple-600 hover:underline font-semibold">
                Start your first interview
            </Link>
        </div>
    )
    return (
        <div className="min-h-screen bg-purple-50 p-8">
            <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-purple-700 mb-6">Interview History</h1>
            <div className="flex flex-col gap-4">
                {interviews.map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
                    <div>
                        <p className="font-bold text-gray-800 text-lg">{item.category} — {item.difficulty}</p>
                        <p className="text-gray-400 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-2xl font-bold text-purple-600">{item.score}/10</p>
                        <Link 
                            href={`/history/${item.id}`}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                        >
                            View Details
                        </Link>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                        >
                        Delete
                        </button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    )
}