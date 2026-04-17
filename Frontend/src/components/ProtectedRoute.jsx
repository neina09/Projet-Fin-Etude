import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ allowed = true, redirectTo = "/", children }) {
  if (!allowed) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
