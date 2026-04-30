import api from './axios'

export const notificationsApi = {
  getAll:       () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}
