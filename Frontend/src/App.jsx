import { Routes, Route, Navigate } from "react-router-dom"
import Form from "./compoants/Form"
import Dashboard from "./compoants/Dashboard"
import Landing from "./page/Landing"

function App() {
  const isLoggedIn = !!localStorage.getItem("token")

  return (
    <Routes>

      {/* أول صفحة تظهر */}
      <Route path="/" element={<Landing />} />

      {/* صفحة تسجيل الدخول */}
      <Route
        path="/auth"
        element={
          <div className="flex w-full h-screen">
            <div className="w-full flex items-center justify-center lg:w-1/2">
              <Form />
            </div>
            <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center bg-gray-200">
              <div className="w-60 h-60 bg-gradient-to-tr from-blue-600 to-pink-500 rounded-full animate-bounce" />
              <div className="w-full h-1/2 bg-white/10 absolute bottom-0 backdrop-blur-lg" />
            </div>
          </div>
        }
      />

      {/* صفحة Dashboard محمية */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
      />

    </Routes>
  )
}

export default App