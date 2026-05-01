import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [appReady, setAppReady]       = useState(false)
  const [loggingIn, setLoggingIn]     = useState(false)
  const [loggingOut, setLoggingOut]   = useState(false)

  // Rehydrate user from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    // Minimum splash display of 1.5 s
    const timer = setTimeout(() => setAppReady(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const login = async (phone, password) => {
    setLoggingIn(true)
    try {
      const res = await authApi.login(phone, password)
      const { token, user: userData } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } finally {
      setLoggingIn(false)
    }
  }

  const register = async (data) => {
    const res = await authApi.register(data)
    return res.data
  }

  const logout = async () => {
    setLoggingOut(true)
    try { await authApi.logout() } catch {}
    await new Promise(r => setTimeout(r, 600))
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setLoggingOut(false)
  }

  const refreshProfile = async () => {
    try {
      const res = await authApi.getProfile()
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
    } catch {}
  }

  const isWorker = user?.role === 'WORKER' || user?.roles?.includes('WORKER')
  const isAdmin  = user?.role === 'ADMIN'  || user?.roles?.includes('ADMIN')

  return (
    <AuthContext.Provider value={{
      user, appReady, loggingIn, loggingOut,
      login, register, logout, refreshProfile,
      isWorker, isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
