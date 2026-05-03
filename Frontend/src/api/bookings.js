import api from './axios'

export const bookingsApi = {
  create:     (data) => api.post('/bookings', data),
  getMy:      ()     => api.get('/bookings/my'),
  getWorker:  ()     => api.get('/bookings/worker'),
  cancel:     (id)   => api.patch(`/bookings/${id}/cancel`),
  respond:    (id, status) => api.patch(`/bookings/${id}/respond`, { status }),
}
