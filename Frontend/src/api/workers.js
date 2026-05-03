import api from './axios'

export const workersApi = {
  getAll:             (params)         => api.get('/workers', { params }),
  getById:            (id)             => api.get(`/workers/${id}`),
  updateAvailability: (status)         => api.put('/workers/availability', { status }),
  updateProfile:      (data)           => api.put('/workers/profile', data),
  rate:               (workerId, data) => api.post(`/workers/${workerId}/rate`, data),
}
