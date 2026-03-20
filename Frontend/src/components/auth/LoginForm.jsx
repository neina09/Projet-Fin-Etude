import React from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

function LoginForm({ formData, handleChange, handleSubmit, showPassword, setShowPassword, onForgot, onSwitch, loading, error, success }) {
  return (
    <div className="w-full max-w-md px-6">

      <h2 className="text-3xl font-black text-[#004384] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
        Welcome back
      </h2>
      <p className="text-sm text-[#004384]/40 mb-8">Sign in to your account</p>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
            <input
              type="email" name="email" placeholder="you@example.com" onChange={handleChange}
              className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FFB909]
                focus:ring-2 focus:ring-[#FFB909]/20 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[4px] text-[#004384]/50 mb-2 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#004384]/25" size={16} />
            <input
              type={showPassword ? "text" : "password"} name="password"
              placeholder="••••••••" onChange={handleChange}
              className="w-full bg-[#FCFDFE] border border-[#004384]/15 text-[#004384] placeholder-[#004384]/25
                rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#FFB909]
                focus:ring-2 focus:ring-[#FFB909]/20 transition-all"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#004384]/30 hover:text-[#004384]/60 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button type="button" onClick={onForgot}
            className="text-xs font-semibold text-[#FFB909] hover:text-[#004384] transition-colors">
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#FFB909] hover:bg-[#004384] disabled:opacity-40
            text-[#004384] hover:text-white font-bold py-3 rounded-full text-sm
            tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(255,185,9,0.35)]
            hover:shadow-[0_4px_20px_rgba(0,67,132,0.35)]">
          {loading ? "Signing in..." : "Log In"}
        </button>

        <p className="text-center text-sm text-[#004384]/40 pt-1">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitch}
            className="text-[#004384] font-bold hover:text-[#FFB909] transition-colors">
            Sign up
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
