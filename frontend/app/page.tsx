import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl font-bold mb-4">AI Interview Prep</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-xl">
        Practice with AI-powered mock interviews. Get instant feedback, track your progress, and land your dream job.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg">
          Get Started
        </Link>
        <Link href="/dashboard" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg">
          Dashboard
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl">
        <div className="p-6 border rounded-lg">
          <h3 className="font-bold text-lg mb-2">4 Categories</h3>
          <p className="text-gray-600">DSA, System Design, HR, and ML interviews</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-bold text-lg mb-2">AI Feedback</h3>
          <p className="text-gray-600">Instant evaluation and detailed feedback</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-bold text-lg mb-2">Track Progress</h3>
          <p className="text-gray-600">Monitor improvement over time</p>
        </div>
      </div>
    </div>
  )
}