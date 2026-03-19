import React from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

function LoginForm({ formData, handleChange, handleSubmit, showPassword, setShowPassword, onForgot, onSwitch, loading, error, success }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#004384] mb-1">Sign In</h2>
        <p className="text-sm text-[#004384]/50 mb-6">Login to your account</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-[#004384]/40" size={18}/>
            <input type="email" name="email" placeholder="Enter your email"
              onChange={handleChange}
              className="w-full border border-[#004384]/30 rounded-lg pl-10 py-2.5 focus:outline-none focus:border-[#004384] text-[#004384]" required/>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#004384]/40" size={18}/>
            <input type={showPassword ? "text" : "password"} name="password"
              placeholder="Enter password" onChange={handleChange}
              className="w-full border border-[#004384]/30 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#004384] text-[#004384]" required/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#004384]/50">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <div className="text-right">
            <span onClick={onForgot} className="text-sm text-[#FFB909] cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#FFB909] text-[#004384] py-2.5 rounded-lg font-semibold hover:bg-[#004384] hover:text-white disabled:opacity-50 transition-all duration-200">
            {loading ? "Please wait..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#004384]/60">
            Don't have an account?
            <span onClick={onSwitch} className="text-[#004384] cursor-pointer ml-1 hover:underline font-semibold">
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginForm