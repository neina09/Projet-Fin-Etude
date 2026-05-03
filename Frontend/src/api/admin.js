import api from './axios'

export const adminApi = {
  getStats:              ()              => api.get('/admin/stats'),
  getPendingWorkers:     ()              => api.get('/admin/workers/pending'),
  approveWorker:         (id)            => api.post(`/admin/workers/${id}/approve`),
  rejectWorker:          (id, reason)    => api.post(`/admin/workers/${id}/reject`, { reason }),
  getUsers:              ()              => api.get('/admin/users'),
  deleteUser:            (id)            => api.delete(`/admin/users/${id}`),
  getTasks:              ()              => api.get('/admin/tasks'),
  getCompletedTasks:     ()              => api.get('/admin/tasks/completed'),
  deleteTask:            (id)            => api.delete(`/admin/tasks/${id}`),
  getEarnings:           ()              => api.get('/admin/earnings'),
  getEarningsHistory:    (period)        => api.get('/admin/earnings/history', { params: { period } }),
  addPenalty:            (id, data)      => api.post(`/admin/workers/${id}/penalty`, data),
  getWorkerPenalties:    (id)            => api.get(`/admin/workers/${id}/penalties`),
  getWorkerAdminReviews: (id)            => api.get(`/admin/workers/${id}/reviews`),
}
