import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'

import Home             from './pages/Home'
import Login            from './pages/auth/Login'
import Register         from './pages/auth/Register'
import OtpVerify        from './pages/auth/OtpVerify'
import ForgotPassword   from './pages/auth/ForgotPassword'
import ResetPassword    from './pages/auth/ResetPassword'
import WorkersPage      from './pages/workers/WorkersPage'
import WorkerProfile    from './pages/workers/WorkerProfile'
import TasksPage        from './pages/tasks/TasksPage'
import TaskDetail       from './pages/tasks/TaskDetail'
import UserDashboard    from './pages/dashboard/UserDashboard'
import WorkerDashboard  from './pages/dashboard/WorkerDashboard'
import BecomeWorker     from './pages/BecomeWorker'
import AdminDashboard   from './pages/admin/AdminDashboard'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function DashboardRoute() {
  const { isWorker, isAdmin } = useAuth()
  if (isAdmin) return <Navigate to="/admin" replace />
  if (isWorker) return <WorkerDashboard />
  return <UserDashboard />
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/verify-otp"     element={<OtpVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/workers"        element={<WorkersPage />} />
        <Route path="/workers/:id"    element={<WorkerProfile />} />
        <Route path="/tasks"          element={<TasksPage />} />
        <Route path="/tasks/:id"      element={<TaskDetail />} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardRoute /></PrivateRoute>} />
        <Route path="/become-worker" element={<PrivateRoute><BecomeWorker /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
