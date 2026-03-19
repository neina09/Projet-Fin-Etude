import React from "react"
import { Mail } from "lucide-react"

function ForgotPassword({ forgotEmail, setForgotEmail, handleForgotPassword, onBack, loading, error, success }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#004384] mb-1">Forgot Password</h2>
        <p className="text-sm text-[#004384]/50 mb-6">Enter your email to reset your password</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#004384]/40" size={18}/>
            <input type="email" placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full border border-[#004384]/30 rounded-lg pl-10 py-2.5 focus:outline-none focus:border-[#004384] text-[#004384]"
            />
          </div>

          <button onClick={handleForgotPassword} disabled={loading}
            className="w-full bg-[#FFB909] text-[#004384] py-2.5 rounded-lg font-semibold hover:bg-[#004384] hover:text-white disabled:opacity-50 transition-all duration-200">
            {loading ? "Sending..." : "Send Reset Token"}
          </button>

          <button onClick={onBack}
            className="w-full text-[#004384]/60 text-sm hover:underline">
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword