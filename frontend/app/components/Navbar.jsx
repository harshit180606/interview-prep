"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router=useRouter()
  const {user,logout}=useAuth()
  const handleLogout = () => {
    logout()
    router.push('/login')
  } 

  return (
    <nav className="bg-purple-700 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interview Prep</h1>
        <div className="flex items-center gap-6">
          <Link className='text-lg' href="/dashboard">Dashboard</Link>
          <Link className='text-lg' href="/interview">Interview</Link>
          <Link className='text-lg' href="/history">History</Link>
          <div className="flex items-center gap-3">
            <span className="font-semibold">{user?.name?.toUpperCase()}</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-purple-700 px-4 py-1 rounded-lg font-semibold hover:bg-purple-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}