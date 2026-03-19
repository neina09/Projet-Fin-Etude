import React from "react"
import { Lock } from "lucide-react"

function ResetPassword({ resetToken, setResetToken, newPassword, setNewPassword, handleResetPassword, onResend, loading, error, success }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#004384] mb-1">Reset Password</h2>
        <p className="text-sm text-[#004384]/50 mb-6">
          Enter the 6-digit code from IntelliJ Console and your new password
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}

        <div className="space-y-4">
          <input type="text" placeholder="Enter 6-digit code"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            className="w-full border border-[#004384]/30 rounded-lg px-4 py-2.5 text-center text-xl tracking-widest focus:outline-none focus:border-[#004384] text-[#004384]"
            maxLength={6}
          />

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-[#004384]/40" size={18}/>
            <input type="password" placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-[#004384]/30 rounded-lg pl-10 py-2.5 focus:outline-none focus:border-[#004384] text-[#004384]"
            />
          </div>

          <button onClick={handleResetPassword} disabled={loading}
            className="w-full bg-[#FFB909] text-[#004384] py-2.5 rounded-lg font-semibold hover:bg-[#004384] hover:text-white disabled:opacity-50 transition-all duration-200">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button onClick={onResend}
            className="w-full text-[#FFB909] text-sm hover:underline font-semibold">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword