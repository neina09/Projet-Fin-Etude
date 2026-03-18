// src/compoants/Dashboard.jsx
import React, { useState, useEffect } from "react"
import { User, LogOut, ShoppingBag, TrendingUp, Users, DollarSign, Settings, X, Eye, EyeOff } from "lucide-react"
import { getMe, changePassword, updateProfile, deleteAccount } from "../api"

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
    if (!profileData.username) {
      setError("Username cannot be empty")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const updated = await updateProfile(profileData.username)
      setUser(updated)
      setSuccess("Profile updated successfully!")
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Please fill all fields")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)

      setSuccess("Password changed successfully!")

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })

    } catch (err) {

      if (err.message.includes("incorrect")) {
        setError("Current password is incorrect")
      } else {
        setError(err.message || "Failed to change password")
      }

    } finally {
      setLoading(false)
    }
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
      <div className="bg-violet-700 text-white text-sm px-6 py-2 flex justify-between items-center">
        <span>Welcome to MyMarketplace</span>
        <span className="opacity-80">{user?.email}</span>
      </div>

      {/* Navbar */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-violet-600">
          MyMarketplace
        </h1>

        <div className="flex items-center gap-5">

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-violet-600"/>
            </div>

            <span className="text-sm font-semibold text-gray-700">
              {user?.username || "User"}
            </span>

          </div>

          <button
            onClick={() => {
              setShowSettings(true)
              setError("")
              setSuccess("")
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 transition"
          >
            <Settings size={17}/>
            Settings
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
          >
            <LogOut size={17}/>
            Logout
          </button>

        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-xl font-bold text-gray-800">
                Settings
              </h3>

              <button
                onClick={() => {
                  setShowSettings(false)
                  setError("")
                  setSuccess("")
                }}
              >
                <X size={20} className="text-gray-500 hover:text-gray-800"/>
              </button>

            </div>

            {/* Tabs */}

            <div className="flex gap-2 mb-6">

              {["profile","password","danger"].map(tab => (

                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setError("")
                    setSuccess("")
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                  ${
                    activeTab === tab
                    ? "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab === "profile"
                    ? "Edit Profile"
                    : tab === "password"
                    ? "Password"
                    : "Danger Zone"}
                </button>

              ))}

            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-500 text-sm mb-4 text-center bg-green-50 p-2 rounded-lg">
                {success}
              </p>
            )}

            {/* Profile */}

            {activeTab === "profile" && (

              <div className="space-y-4">

                <div>

                  <label className="text-sm text-gray-600 mb-1 block">
                    Username
                  </label>

                  <div className="relative">

                    <User
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />

                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e)=>{
                        setProfileData({ username:e.target.value })
                        setError("")
                      }}
                      className="w-full border rounded-lg pl-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                  </div>

                </div>

                <div>

                  <label className="text-sm text-gray-600 mb-1 block">
                    Email (cannot change)
                  </label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400"
                  />

                </div>

                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

              </div>

            )}

            {/* Password */}

            {activeTab === "password" && (

              <div className="space-y-4">

                <div className="relative">

                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e)=>{
                      setPasswordData({
                        ...passwordData,
                        currentPassword:e.target.value
                      })
                      setError("")
                    }}
                    className="w-full border rounded-lg px-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <button
                    type="button"
                    onClick={()=>setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showCurrentPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>

                </div>

                <div className="relative">

                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e)=>{
                      setPasswordData({
                        ...passwordData,
                        newPassword:e.target.value
                      })
                      setError("")
                    }}
                    className="w-full border rounded-lg px-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />

                  <button
                    type="button"
                    onClick={()=>setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>

                </div>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e)=>{
                    setPasswordData({
                      ...passwordData,
                      confirmNewPassword:e.target.value
                    })
                    setError("")
                  }}
                  className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  )
}

export default Dashboard