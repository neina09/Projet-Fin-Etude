import React from "react"

function VerifyScreen({ email, verificationCode, setVerificationCode, handleVerify, handleResend, loading, error, success }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#004384] mb-1">Verify Your Account</h2>
        <p className="text-sm text-[#004384]/50 mb-6">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}

        <div className="space-y-4">
          <input type="text" placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full border border-[#004384]/30 rounded-lg px-4 py-2.5 text-center text-xl tracking-widest focus:outline-none focus:border-[#004384] text-[#004384]"
            maxLength={6}
          />

          <button onClick={handleVerify} disabled={loading}
            className="w-full bg-[#FFB909] text-[#004384] py-2.5 rounded-lg font-semibold hover:bg-[#004384] hover:text-white disabled:opacity-50 transition-all duration-200">
            {loading ? "Verifying..." : "Verify Account"}
          </button>

          <button onClick={handleResend} disabled={loading}
            className="w-full text-[#004384]/60 text-sm hover:underline">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyScreen