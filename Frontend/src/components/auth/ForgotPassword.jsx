import React from "react"
import { Mail, ArrowLeft } from "lucide-react"

function ForgotPassword({ forgotEmail, setForgotEmail, handleForgotPassword, onBack, loading, error, success }) {
  return (
    <div className="w-full max-w-md px-6">

      <button onClick={onBack}
        className="flex items-center gap-2 text-[#004384]/40 hover:text-[#004384] text-sm mb-8 transition-colors font-medium">
        <ArrowLeft size={14} /> Back to sign in
      </button>

      <h2 className="text-3xl font-black text-[#004384] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        Forgot password?
      </h2>
      <p className="text-sm text-[#004384]/40 mb-8">
        Enter your email and we'll send you a reset code
      </p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />{success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
            <input
              type="email" placeholder="you@example.com" value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FFB909]
                focus:ring-2 focus:ring-[#FFB909]/20 transition-all"
            />
          </div>
        </div>

        <button onClick={handleForgotPassword} disabled={loading}
          className="w-full bg-[#FFB909] hover:bg-[#004384] disabled:opacity-40
            text-[#004384] hover:text-white font-bold py-3 rounded-full text-sm
            tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(255,185,9,0.35)]
            hover:shadow-[0_4px_20px_rgba(0,67,132,0.35)]">
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword