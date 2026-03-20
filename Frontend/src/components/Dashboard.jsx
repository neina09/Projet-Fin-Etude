import React, { useState, useEffect } from "react"
import { User, LogOut, Settings, X, Eye, EyeOff } from "lucide-react"
import { getMe, changePassword, updateProfile, deleteAccount } from "../api"
import logo from "../assets/logo.png"

function Dashboard({ onLogout }) {

  const [user, setUser] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [profileData, setProfileData] = useState({ username: "" })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    getMe()
      .then(data => {
        setUser(data)
        setProfileData({ username: data.username })
      })
      .catch(() => onLogout())
  }, [])

  const handleUpdateProfile = async () => {
    if (!profileData.username) { setError("Username cannot be empty"); return }
    setLoading(true); setError(""); setSuccess("")
    try {
      const updated = await updateProfile(profileData.username)
      setUser(updated)
      setSuccess("Profile updated successfully!")
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally { setLoading(false) }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) { setError("Please fill all fields"); return }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) { setError("New passwords do not match"); return }
    if (passwordData.newPassword.length < 6) { setError("Password must be at least 6 characters"); return }
    setLoading(true); setError(""); setSuccess("")
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setSuccess("Password changed successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
    } catch (err) {
      setError(err.message.includes("incorrect") ? "Current password is incorrect" : err.message || "Failed to change password")
    } finally { setLoading(false) }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await deleteAccount()
      onLogout()
    } catch (err) {
      setError(err.message || "Failed to delete account")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Bar */}
      <div className="bg-[#004384] text-white text-sm px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFB909]" />
          <span className="font-medium">chghloni</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFB909]" />
          <span className="text-white/50 text-xs uppercase tracking-widest">Recrutement</span>
        </div>
        <span className="text-white/60">{user?.email}</span>
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-sm border-b border-[#004384]/10 px-6 py-4 flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-2xl font-black leading-none text-[#004384]"
              style={{ fontFamily: "Georgia, serif" }}>
              chghloni
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-[#FFB909]" />
              <span className="text-[9px] font-bold uppercase tracking-[3px] text-[#004384]/40">Recrutement</span>
              <div className="w-1 h-1 rounded-full bg-[#FFB909]" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#004384]/10 rounded-full flex items-center justify-center">
              <User size={18} className="text-[#004384]" />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {user?.username || "User"}
            </span>
          </div>

          <button
            onClick={() => { setShowSettings(true); setError(""); setSuccess("") }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#004384] transition-colors"
          >
            <Settings size={17} />
            Settings
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-[#004384] mb-2">
          Welcome back, {user?.username || "User"} 👋
        </h2>
        <p className="text-gray-400 text-sm mb-8">Here's what's happening on your account.</p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Active Jobs",     value: "0",   color: "bg-[#004384]/10 text-[#004384]" },
            { label: "Applications",    value: "0",   color: "bg-[#FFB909]/10 text-[#FFB909]" },
            { label: "Profile Views",   value: "0",   color: "bg-green-50 text-green-600"      },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm text-gray-400 mb-2">{label}</p>
              <p className={`text-3xl font-black rounded-lg px-2 py-1 inline-block ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#004384]">Settings</h3>
              <button onClick={() => { setShowSettings(false); setError(""); setSuccess("") }}>
                <X size={20} className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {["profile", "password", "danger"].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(""); setSuccess("") }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === tab
                      ? "bg-[#004384] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {tab === "profile" ? "Edit Profile" : tab === "password" ? "Password" : "Danger Zone"}
                </button>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">{success}</p>}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#004384]/60 mb-1 block font-medium">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-[#004384]/30" size={18} />
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => { setProfileData({ username: e.target.value }); setError("") }}
                      className="w-full border border-[#004384]/20 rounded-xl pl-10 py-2.5
                        focus:outline-none focus:border-[#FFB909] focus:ring-2 focus:ring-[#FFB909]/20
                        text-[#004384] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#004384]/60 mb-1 block font-medium">Email (cannot change)</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border border-[#004384]/10 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-400"
                  />
                </div>
                <button onClick={handleUpdateProfile} disabled={loading}
                  className="w-full bg-[#FFB909] text-[#004384] py-2.5 rounded-xl font-semibold
                    hover:bg-[#004384] hover:text-white disabled:opacity-50 transition-all duration-200">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => { setPasswordData({ ...passwordData, currentPassword: e.target.value }); setError("") }}
                    className="w-full border border-[#004384]/20 rounded-xl px-4 pr-10 py-2.5
                      focus:outline-none focus:border-[#FFB909] focus:ring-2 focus:ring-[#FFB909]/20
                      text-[#004384] transition-all"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-[#004384]/40 hover:text-[#004384]">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e) => { setPasswordData({ ...passwordData, newPassword: e.target.value }); setError("") }}
                    className="w-full border border-[#004384]/20 rounded-xl px-4 pr-10 py-2.5
                      focus:outline-none focus:border-[#FFB909] focus:ring-2 focus:ring-[#FFB909]/20
                      text-[#004384] transition-all"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-[#004384]/40 hover:text-[#004384]">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => { setPasswordData({ ...passwordData, confirmNewPassword: e.target.value }); setError("") }}
                  className="w-full border border-[#004384]/20 rounded-xl px-4 py-2.5
                    focus:outline-none focus:border-[#FFB909] focus:ring-2 focus:ring-[#FFB909]/20
                    text-[#004384] transition-all"
                />
                <button onClick={handleChangePassword} disabled={loading}
                  className="w-full bg-[#FFB909] text-[#004384] py-2.5 rounded-xl font-semibold
                    hover:bg-[#004384] hover:text-white disabled:opacity-50 transition-all duration-200">
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-600 mb-1">Delete Account</p>
                  <p className="text-xs text-red-400">This action is permanent and cannot be undone.</p>
                </div>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)}
                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold
                      hover:bg-red-600 transition-all duration-200">
                    Delete My Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-center text-gray-600 font-medium">Are you sure?</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                        Cancel
                      </button>
                      <button onClick={handleDeleteAccount} disabled={loading}
                        className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-all">
                        {loading ? "Deleting..." : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard