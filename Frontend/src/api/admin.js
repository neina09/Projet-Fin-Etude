import api from './axios'

export const adminApi = {
  getStats:          ()    => api.get('/admin/stats'),
  getPendingWorkers: ()    => api.get('/admin/workers/pending'),
  approveWorker:     (id)  => api.post(`/admin/workers/${id}/approve`),
  rejectWorker:      (id)  => api.post(`/admin/workers/${id}/reject`),
  getUsers:          ()    => api.get('/admin/users'),
  deleteUser:        (id)  => api.delete(`/admin/users/${id}`),
  getTasks:          ()    => api.get('/admin/tasks'),
  deleteTask:        (id)  => api.delete(`/admin/tasks/${id}`),
}
