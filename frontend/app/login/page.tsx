'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { token, loading } = useAuth()

  useEffect(()=>{
    if(!loading && token) router.push('/dashboard')
  },[loading,token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">Interview Prep</h1>
        <p className="text-gray-500 mb-8">Prepare smarter. Get hired faster.</p>
        <a 
          href="https://interview-prep-backend-ro35.onrender.com/auth/google"
          className="flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Login with Google
        </a>
      </div>
    </div>
  )
}