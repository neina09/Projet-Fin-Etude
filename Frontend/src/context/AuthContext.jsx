import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (phone, password) => {
    const res = await authApi.login(phone, password)
    const { token, user: userData } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res = await authApi.register(data)
    return res.data
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, isWorker, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
