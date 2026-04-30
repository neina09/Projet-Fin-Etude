import api from './axios'

export const bookingsApi = {
  create:     (data) => api.post('/bookings', data),
  getMy:      ()     => api.get('/bookings/my'),
  getWorker:  ()     => api.get('/bookings/worker'),
}
