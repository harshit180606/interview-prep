'use client'
import { useEffect, useState , Suspense} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, loading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const fetchDetails=async ()=>{
      const urlToken = searchParams.get('token')
      if(urlToken) {
        localStorage.setItem('token', urlToken)
        window.history.replaceState({}, '', '/dashboard')
      }

      if(!loading && !token) {
        router.push('/login')
      }
      else{
        const res=await api.get('/user/me')
        setUser((res as any).data);

        const res_history=await api.get('/user/dashboard')
        setDashboardData((res_history as any).data)
      }
    }
    fetchDetails()
    }, [loading, token])

  if(loading || !user || !dashboardData) return <div>Loading...</div>

  return (
  <div className="min-h-screen bg-purple-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        Welcome, {user?.name}
      </h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-1">Total Interviews</p>
          <p className="text-4xl font-bold text-purple-600">{dashboardData?.totalInterviews}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-500 mb-1">Average Score</p>
          <p className="text-4xl font-bold text-purple-600">{dashboardData?.avgScore}/10</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Interviews</h2>
      <div className="flex flex-col gap-4">
        {dashboardData?.recentInterviews?.map((item: any) => (
          <div key={item.id} className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{item.category} — {item.difficulty}</p>
              <p className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{item.score}/10</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
