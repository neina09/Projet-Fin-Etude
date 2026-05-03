import api from './axios'

export const tasksApi = {
  getAll:        (params)               => api.get('/tasks', { params }),
  getMy:         ()                     => api.get('/tasks/my'),
  getById:       (id)                   => api.get(`/tasks/${id}`),
  create:        (data)                 => api.post('/tasks', data),
  update:        (id, data)             => api.put(`/tasks/${id}`, data),
  delete:        (id)                   => api.delete(`/tasks/${id}`),
  submitOffer:   (taskId, data)         => api.post(`/tasks/${taskId}/offers`, data),
  getOffers:     (taskId)              => api.get(`/tasks/${taskId}/offers`),
  acceptOffer:   (taskId, offerId)     => api.post(`/tasks/${taskId}/offers/${offerId}/accept`),
}
