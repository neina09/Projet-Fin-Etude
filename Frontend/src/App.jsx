import React, { Suspense, lazy, useCallback, useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { getMe } from "./api"
import "leaflet/dist/leaflet.css"
import { clearStoredSession, hasStoredSession, storeSessionToken } from "./utils/auth"
import { useLanguage } from "./i18n/LanguageContext"

const LandingPage = lazy(() => import("./pages/LandingPage"))
const Dashboard = lazy(() => import("./components/Dashboard"))
const BecomeWorker = lazy(() => import("./components/BecomeWorker"))

function PageLoader() {
  const { dir, t } = useLanguage()

  return (
    <div className="page-shell flex items-center justify-center" dir={dir}>
      <div className="card-lg">
        <div className="flex flex-col items-center gap-6">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-100 border-t-primary shadow-sm" />
          <div className="text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900">{t("common.loadingPage")}</p>
            <p className="t-label italic">{t("common.preparingContent")}</p>
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
  const { dir, t } = useLanguage()

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
      <div className="page-shell flex items-center justify-center" dir={dir}>
        <div className="card-lg">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-100 border-t-primary" />
            <div>
              <p className="text-sm font-black text-surface-900">{t("common.checkingSession")}</p>
              <p className="text-xs font-bold text-surface-400">{t("common.checkingSessionHint")}</p>
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
