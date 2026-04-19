import React, { Suspense, lazy, useCallback, useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import AuthForm from "./components/AuthForm"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { getMe } from "./api"
import authBg from "./assets/worker-bg.jpg"
import "leaflet/dist/leaflet.css"
import { clearStoredSession, hasStoredSession, storeSessionToken } from "./utils/auth"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const BecomeWorker = lazy(() => import("./components/BecomeWorker"))

function PageLoader({ message = "جاري تحميل الصفحة..." }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-surface-50" dir="rtl">
      <div className="rounded-3xl border border-surface-200 bg-white px-8 py-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-100 border-t-primary" />
          <div>
            <p className="text-sm font-black text-surface-900">{message}</p>
            <p className="text-xs font-bold text-surface-400">يتم تجهيز المحتوى المطلوب.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [authStatus, setAuthStatus] = useState(hasStoredSession())
  const [checkingSession, setCheckingSession] = useState(hasStoredSession())
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    const validateStoredSession = async () => {
      if (!hasStoredSession()) {
        if (active) setCheckingSession(false)
        return
      }

      try {
        await getMe()
        if (active) setAuthStatus(true)
      } catch {
        clearStoredSession()
        if (active) setAuthStatus(false)
      } finally {
        if (active) setCheckingSession(false)
      }
    }

    validateStoredSession()

    return () => {
      active = false
    }
  }, [])

  const handleLogin = useCallback((token) => {
    storeSessionToken(token)
    setAuthStatus(true)
    navigate("/dashboard")
  }, [navigate])

  const handleLogout = useCallback(() => {
    clearStoredSession()
    setAuthStatus(false)
    navigate("/")
  }, [navigate])

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50" dir="rtl">
        <div className="rounded-3xl border border-surface-200 bg-white px-8 py-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-100 border-t-primary" />
            <div>
              <p className="text-sm font-black text-surface-900">جارٍ التحقق من الجلسة</p>
              <p className="text-xs font-bold text-surface-400">يتم فحص صلاحية الدخول قبل فتح اللوحة.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage onLoginSuccess={handleLogin} />} />
        <Route
          path="/dashboard/*"
          element={(
            <ProtectedRoute allowed={authStatus} redirectTo="/">
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/become-worker"
          element={(
            <ProtectedRoute allowed={authStatus} redirectTo="/auth">
              <BecomeWorker />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}


export default App
