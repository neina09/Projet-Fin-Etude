import api from './axios'

export const authApi = {
  sendOtp:        (phone)                          => api.post('/auth/send-otp', { phone }),
  verifyOtp:      (phone, code)                    => api.post('/auth/verify-otp', { phone, code }),
  register:       (data)                           => api.post('/auth/register', data),
  login:          (phone, password)                => api.post('/auth/login', { phone, password }),
  logout:         ()                               => api.post('/auth/logout'),
  getProfile:     ()                               => api.get('/auth/me'),
  updateProfile:  (data)                           => api.put('/auth/me', data),
  becomeWorker:   (data)                           => api.post('/auth/become-worker', data),
  forgotPassword: (phone)                          => api.post('/auth/forgot-password', { phone }),
  resetPassword:  (phone, code, newPassword)       => api.post('/auth/reset-password', { phone, code, password: newPassword }),
}
