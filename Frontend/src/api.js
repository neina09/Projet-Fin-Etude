const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8081").replace(/\/$/, "")

const getToken = () => localStorage.getItem("token")

const buildHeaders = (extraHeaders = {}, withAuth = false) => {
  const headers = { ...extraHeaders }
  const token = getToken()

  if (withAuth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

const getErrorMessage = (payload) => {
  if (!payload) return "حدث خطأ غير متوقع"
  if (typeof payload === "string") return payload
  if (payload.message) return payload.message
  if (payload.error) return payload.error
  return "حدث خطأ غير متوقع"
}

const request = async (path, options = {}) => {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, options)
  } catch (error) {
    throw new Error("تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية وإعداد عنوان API بشكل صحيح.")
  }

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload))
  }

  return payload
}

export const registerUser = async (username, phone, password) =>
  request("/auth/signup", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ username, phone, password })
  })

export const loginUser = async (phone, password) =>
  request("/auth/login", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ phone, password })
  })

export const verifyUser = async (phone, verificationCode) =>
  request("/auth/verify", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ phone, verificationCode })
  })

export const resendCode = async (phone) =>
  request(`/auth/resend?phone=${encodeURIComponent(phone)}`, {
    method: "POST",
    headers: buildHeaders()
  })

export const forgotPassword = async (phone) =>
  request("/auth/forgot-password", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ phone })
  })

export const resetPassword = async (token, newPassword) =>
  request("/auth/reset-password", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ token, newPassword })
  })

export const getMe = async () =>
  request("/users/me", {
    headers: buildHeaders({}, true)
  })

export const changePassword = async (currentPassword, newPassword) =>
  request("/users/change-password", {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify({ currentPassword, newPassword })
  })

export const updateProfile = async ({ username, phone }) =>
  request("/users/update-profile", {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify({ username, phone })
  })

export const deleteAccount = async () =>
  request("/users/delete", {
    method: "DELETE",
    headers: buildHeaders({}, true)
  })

export const getOpenTasks = async () =>
  request("/api/tasks/open", {
    headers: buildHeaders({}, true)
  })

export const searchOpenTasks = async ({ keyword = "", address = "", profession = "" } = {}) => {
  const params = new URLSearchParams()

  if (keyword.trim()) params.set("keyword", keyword.trim())
  if (address.trim()) params.set("address", address.trim())
  if (profession.trim()) params.set("profession", profession.trim())

  const query = params.toString()

  return request(`/api/tasks/open/search${query ? `?${query}` : ""}`, {
    headers: buildHeaders({}, true)
  })
}

export const getMyTasks = async () =>
  request("/api/tasks/my-tasks", {
    headers: buildHeaders({}, true)
  })

export const createTask = async (taskData) =>
  request("/api/tasks", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(taskData)
  })

export const updateTask = async (taskId, taskData) =>
  request(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(taskData)
  })

export const deleteTask = async (taskId) =>
  request(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: buildHeaders({}, true)
  })

export const markTaskDone = async (taskId) =>
  request(`/api/tasks/${taskId}/done`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const cancelTaskRequest = async (taskId) =>
  request(`/api/tasks/${taskId}/cancel`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const getOffersForTask = async (taskId) =>
  request(`/api/tasks/${taskId}/offers`, {
    headers: buildHeaders({}, true)
  })

export const getMyOffers = async () =>
  request("/api/tasks/my-offers", {
    headers: buildHeaders({}, true)
  })

export const createOffer = async (taskId, offerData) =>
  request(`/api/tasks/${taskId}/offer`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(offerData)
  })

export const selectOffer = async (offerId) =>
  request(`/api/tasks/offers/${offerId}/select`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const approveTask = async (taskId) =>
  request(`/api/tasks/${taskId}/approve`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const rejectTask = async (taskId) =>
  request(`/api/tasks/${taskId}/reject`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const acceptOffer = async (offerId) =>
  request(`/api/tasks/offers/${offerId}/worker-accept`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const refuseOffer = async (offerId) =>
  request(`/api/tasks/offers/${offerId}/worker-refuse`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const getWorkers = async () =>
  request("/api/workers", {
    headers: buildHeaders({}, true)
  })

export const getWorkerById = async (workerId) =>
  request(`/api/workers/${workerId}`, {
    headers: buildHeaders({}, true)
  })

export const getMyWorkerProfile = async () =>
  request("/api/workers/me", {
    headers: buildHeaders({}, true)
  })

export const createWorkerProfile = async (workerData) =>
  request("/api/workers/register", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(workerData)
  })

export const updateWorkerProfile = async (workerId, workerData) =>
  request(`/api/workers/${workerId}`, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(workerData)
  })

export const updateWorkerAvailability = async (workerId, availability) =>
  request(`/api/workers/${workerId}/availability?availability=${encodeURIComponent(availability)}`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const uploadWorkerImage = async (workerId, file) => {
  const formData = new FormData()
  formData.append("file", file)

  return request(`/api/workers/${workerId}/upload-image`, {
    method: "POST",
    headers: buildHeaders({}, true),
    body: formData
  })
}

export const uploadIdentityDocument = async (workerId, file) => {
  const formData = new FormData()
  formData.append("file", file)

  return request(`/api/workers/${workerId}/upload-identity-document`, {
    method: "POST",
    headers: buildHeaders({}, true),
    body: formData
  })
}

export const verifyWorker = async (workerId) =>
  request(`/api/workers/admin/${workerId}/verify`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const rejectWorker = async (workerId) =>
  request(`/api/workers/admin/${workerId}/reject`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const getMyBookings = async () =>
  request("/api/bookings/my-bookings", {
    headers: buildHeaders({}, true)
  })

export const getMyBookingRequests = async () =>
  request("/api/bookings/my-requests", {
    headers: buildHeaders({}, true)
  })

export const createBooking = async (bookingData) =>
  request("/api/bookings", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(bookingData)
  })

export const updateBookingStatus = async (bookingId, status) =>
  request(`/api/bookings/${bookingId}/${status}`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const createRating = async (bookingId, ratingData) =>
  request(`/api/ratings/booking/${bookingId}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(ratingData)
  })

export const getWorkerRatings = async (workerId) =>
  request(`/api/ratings/worker/${workerId}`, {
    headers: buildHeaders({}, true)
  })

export const getMyNotifications = async () =>
  request("/api/notifications", {
    headers: buildHeaders({}, true)
  })

export const markNotificationRead = async (notificationId) =>
  request(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: buildHeaders({}, true)
  })

export const getAdminDashboard = async () =>
  request("/api/admin/dashboard", {
    headers: buildHeaders({}, true)
  })

export const getAllUsers = async () =>
  request("/users", {
    headers: buildHeaders({}, true)
  })

export const getChatMessages = async (recipientId) =>
  request(`/api/chat/history/${recipientId}`, {
    headers: buildHeaders({}, true)
  })

export const sendChatMessage = async (recipientId, content) =>
  request("/api/chat/send", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify({ recipientId, content })
  })
