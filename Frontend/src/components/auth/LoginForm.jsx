import React from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

function LoginForm({ handleChange, handleSubmit, showPassword, setShowPassword, onForgot, onSwitch, loading, error, success }) {
  return (
    <div className="w-full max-w-sm mx-auto p-1 animate-fade-in" dir="rtl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-surface-900 mb-3 tracking-tight">
          مرحباً بعودتك
        </h2>
        <p className="text-sm font-medium text-surface-500">
          سجّل الدخول لمتابعة أعمالك وإدارة مهامك
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-pulse" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-3 bg-primary-soft border border-primary/10 text-primary text-sm px-4 py-3 rounded-xl mb-6 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-surface-700 mr-1 block">
            البريد الإلكتروني
          </label>
          <div className="relative group">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="email" 
              name="email" 
              placeholder="name@company.com" 
              onChange={handleChange}
              className="saas-input pr-10 hover:border-surface-300"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-surface-700 block">
              كلمة المرور
            </label>
            <button 
              type="button" 
              onClick={onForgot}
              className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="••••••••" 
              onChange={handleChange}
              className="saas-input pr-10 pl-10 hover:border-surface-300"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-saas btn-primary h-12 shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              جاري الدخول...
            </span>
          ) : "تسجيل الدخول"}
        </button>

        {/* Switch */}
        <p className="text-center text-sm font-medium text-surface-500 pt-4">
          ليس لديك حساب؟{" "}
          <button 
            type="button" 
            onClick={onSwitch}
            className="text-primary font-bold hover:underline"
          >
            أنشئ حساباً مجانياً
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginForm