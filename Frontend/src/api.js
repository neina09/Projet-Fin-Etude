const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")
const OPENROUTESERVICE_API_KEY = import.meta.env.VITE_OPENROUTESERVICE_API_KEY || ""
const UPLOADS_ASSET_VERSION_KEY = "uploadsAssetVersion"

const getUploadsAssetVersion = () => {
  const raw = localStorage.getItem(UPLOADS_ASSET_VERSION_KEY)
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

const bumpUploadsAssetVersion = () => {
  const nextVersion = Date.now()
  localStorage.setItem(UPLOADS_ASSET_VERSION_KEY, String(nextVersion))
  return nextVersion
}

const withAssetVersion = (url) => {
  if (!url || !url.includes("/uploads/")) return url
  if (url.includes("?v=")) return url
  const version = getUploadsAssetVersion()
  if (!version) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}v=${version}`
}

export const resolveAssetUrl = (value) => {
  if (!value || typeof value !== "string") return ""

  const trimmed = value.trim().replace(/\\/g, "/")
  if (!trimmed) return ""

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return withAssetVersion(trimmed)
  }

  const uploadsIndex = trimmed.indexOf("/uploads/")
  if (uploadsIndex >= 0) {
    return withAssetVersion(`${BASE_URL}${trimmed.slice(uploadsIndex)}`)
  }

  if (trimmed.startsWith("uploads/")) {
    return withAssetVersion(`${BASE_URL}/${trimmed}`)
  }

  if (trimmed.startsWith("/uploads/")) {
    return withAssetVersion(`${BASE_URL}${trimmed}`)
  }

  if (trimmed.startsWith("/workers/")) {
    return withAssetVersion(`${BASE_URL}/uploads${trimmed}`)
  }

  if (trimmed.startsWith("/")) {
    return withAssetVersion(`${BASE_URL}${trimmed}`)
  }

  return withAssetVersion(`${BASE_URL}/${trimmed}`)
}

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

export const isAuthenticationError = (error) => {
  const message = String(error?.message || "").toLowerCase()

  return Boolean(
    error?.status === 401 ||
    message.includes("jwt") ||
    message.includes("signature") ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("token")
  )
}

const request = async (path, options = {}) => {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, options)
  } catch {
    throw new Error("تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية وإعداد عنوان API بشكل صحيح.")
  }

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload))
    error.status = response.status

    if (response.status === 401) {
      localStorage.removeItem("token")
    }

    throw error
  }

  return payload
}

const normalizeWorker = (worker) => {
  if (!worker || typeof worker !== "object") return worker

  const verificationStatus = worker.verificationStatus || (worker.verified ? "VERIFIED" : undefined)
  const workerJob = worker.job || worker.profession || worker.specialty || ""
  const workerImage = worker.imageUrl || worker.workerImageUrl || worker.profileImageUrl || worker.userImageUrl || ""

  return {
    ...worker,
    job: workerJob,
    profession: worker.profession || workerJob,
    verificationStatus,
    verified: Boolean(worker.verified ?? verificationStatus === "VERIFIED"),
    available: Boolean(worker.available ?? worker.availability === "AVAILABLE"),
    imageUrl: resolveAssetUrl(workerImage),
    identityDocumentUrl: resolveAssetUrl(worker.identityDocumentUrl)
  }
}

const normalizeBooking = (booking) => {
  if (!booking || typeof booking !== "object") return booking

  return {
    ...booking,
    workerJob: booking.workerJob || booking.workerProfession || "",
    isRated: Boolean(booking.isRated ?? booking.rated),
    rated: Boolean(booking.rated ?? booking.isRated),
    workerImageUrl: resolveAssetUrl(booking.workerImageUrl),
    userImageUrl: resolveAssetUrl(booking.userImageUrl)
  }
}

const normalizeTask = (task) => {
  if (!task || typeof task !== "object") return task
  return {
    ...task,
    userImageUrl: resolveAssetUrl(task.userImageUrl),
    assignedWorkerImageUrl: resolveAssetUrl(task.assignedWorkerImageUrl)
  }
}

const normalizeOffer = (offer) => {
  if (!offer || typeof offer !== "object") return offer

  return {
    ...offer,
    workerJob: offer.workerJob || offer.workerProfession || "",
    workerImageUrl: resolveAssetUrl(offer.workerImageUrl),
    taskUserImageUrl: resolveAssetUrl(offer.taskUserImageUrl)
  }
}

const normalizeNotification = (notification) => {
  if (!notification || typeof notification !== "object") return notification
  return {
    ...notification,
    isRead: Boolean(notification.isRead ?? notification.read),
    read: Boolean(notification.read ?? notification.isRead)
  }
}



const normalizePage = (payload, itemNormalizer = (item) => item) => {
  if (Array.isArray(payload)) {
    return {
      content: payload.map(itemNormalizer),
      page: 0,
      size: payload.length,
      totalElements: payload.length,
      totalPages: 1,
      first: true,
      last: true
    }
  }

  if (payload && Array.isArray(payload.content)) {
    return {
      ...payload,
      content: payload.content.map(itemNormalizer)
    }
  }

  return {
    content: [],
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  }
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

export const uploadUserImage = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const payload = await request("/users/upload-image", {
    method: "POST",
    headers: buildHeaders({}, true),
    body: formData
  })
  bumpUploadsAssetVersion()
  return payload
}

export const deleteAccount = async () =>
  request("/users/delete", {
    method: "DELETE",
    headers: buildHeaders({}, true)
  })

export const getOpenTasks = async () =>
  normalizePage(
    await request("/api/tasks/open", {
      headers: buildHeaders()
    }),
    normalizeTask
  )

export const searchOpenTasks = async ({ keyword = "", address = "", profession = "" } = {}) => {
  const params = new URLSearchParams()

  if (keyword.trim()) params.set("keyword", keyword.trim())
  if (address.trim()) params.set("address", address.trim())
  if (profession.trim()) params.set("profession", profession.trim())

  const query = params.toString()

  return normalizePage(
    await request(`/api/tasks/open/search${query ? `?${query}` : ""}`, {
      headers: buildHeaders()
    }),
    normalizeTask
  )
}

export const getMyTasks = async () =>
  normalizePage(
    await request("/api/tasks/my-tasks", {
      headers: buildHeaders({}, true)
    }),
    normalizeTask
  )

export const getTasksAssignedToMe = async () =>
  (await request("/api/tasks/assigned-to-me", {
    headers: buildHeaders({}, true)
  })).map(normalizeTask)

export const createTask = async (taskData) =>
  normalizeTask(
    await request("/api/tasks", {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, true),
      body: JSON.stringify(taskData)
    })
  )

export const updateTask = async (taskId, taskData) =>
  normalizeTask(
    await request(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: buildHeaders({ "Content-Type": "application/json" }, true),
      body: JSON.stringify(taskData)
    })
  )

export const deleteTask = async (taskId) =>
  request(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: buildHeaders({}, true)
  })

export const markTaskDone = async (taskId) =>
  normalizeTask(
    await request(`/api/tasks/${taskId}/done`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const cancelTaskRequest = async (taskId) =>
  normalizeTask(
    await request(`/api/tasks/${taskId}/cancel`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const getOffersForTask = async (taskId) =>
  (await request(`/api/tasks/${taskId}/offers`, {
    headers: buildHeaders({}, true)
  })).map(normalizeOffer)

export const getMyOffers = async () =>
  (await request("/api/tasks/my-offers", {
    headers: buildHeaders({}, true)
  })).map(normalizeOffer)

export const createOffer = async (taskId, offerData) =>
  normalizeOffer(
    await request(`/api/tasks/${taskId}/offer`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, true),
      body: JSON.stringify(offerData)
    })
  )

export const selectOffer = async (offerId) =>
  normalizeOffer(
    await request(`/api/tasks/offers/${offerId}/select`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const approveTask = async (taskId) =>
  normalizeTask(
    await request(`/api/tasks/${taskId}/approve`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const rejectTask = async (taskId) =>
  normalizeTask(
    await request(`/api/tasks/${taskId}/reject`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const getPendingTasks = async () =>
  normalizePage(
    await request("/api/tasks/admin/pending", {
      headers: buildHeaders({}, true)
    }),
    normalizeTask
  )

export const acceptOffer = async (offerId) =>
  normalizeOffer(
    await request(`/api/tasks/offers/${offerId}/worker-accept`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const refuseOffer = async (offerId) =>
  normalizeOffer(
    await request(`/api/tasks/offers/${offerId}/worker-refuse`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const getWorkers = async () =>
  (await request("/api/workers", {
    headers: buildHeaders()
  })).map(normalizeWorker)

export const getWorkerById = async (workerId) =>
  normalizeWorker(
    await request(`/api/workers/${workerId}`, {
      headers: buildHeaders()
    })
  )

export const getPendingWorkers = async () =>
  (await request("/api/workers/admin/pending", {
    headers: buildHeaders({}, true)
  })).map(normalizeWorker)

export const getMyWorkerProfile = async () =>
  normalizeWorker(
    await request("/api/workers/me", {
      headers: buildHeaders({}, true)
    })
  )

export const createWorkerProfile = async (workerData) => {
  const payload = await request("/api/workers/register", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(workerData)
  })

  const worker = normalizeWorker(payload?.worker || payload)

  return {
    ...worker,
    worker,
    token: payload?.token,
    expiresIn: payload?.expiresIn
  }
}

export const updateWorkerProfile = async (workerId, workerData) =>
  normalizeWorker(
    await request(`/api/workers/${workerId}`, {
      method: "PUT",
      headers: buildHeaders({ "Content-Type": "application/json" }, true),
      body: JSON.stringify(workerData)
    })
  )

export const updateWorkerAvailability = async (workerId, availability) =>
  normalizeWorker(
    await request(`/api/workers/${workerId}/availability?availability=${encodeURIComponent(availability)}`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const uploadWorkerImage = async (workerId, file) => {
  const formData = new FormData()
  formData.append("file", file)

  const payload = await request(`/api/workers/${workerId}/upload-image`, {
    method: "POST",
    headers: buildHeaders({}, true),
    body: formData
  })
  bumpUploadsAssetVersion()
  return normalizeWorker(payload)
}

export const uploadIdentityDocument = async (workerId, file) => {
  const formData = new FormData()
  formData.append("file", file)

  return normalizeWorker(
    await request(`/api/workers/${workerId}/upload-identity-document`, {
      method: "POST",
      headers: buildHeaders({}, true),
      body: formData
    })
  )
}

/**
 * وثائق الهوية غير معرّضة كملفات ثابتة علنية؛ يجب جلبها عبر API مع التوكن.
 * يعيد رابط blob يجب استدعاء URL.revokeObjectURL عليه عند الانتهاء.
 */
export const fetchWorkerIdentityDocumentPreview = async (workerId) => {
  const response = await fetch(`${BASE_URL}/api/workers/${workerId}/identity-document`, {
    method: "GET",
    headers: buildHeaders({}, true)
  })

  if (!response.ok) {
    let msg = "تعذر تحميل وثيقة الهوية"
    try {
      const raw = await response.text()
      if (raw && raw.length < 240) msg = raw
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }

  const blob = await response.blob()
  return {
    objectUrl: URL.createObjectURL(blob),
    mediaType: blob.type || ""
  }
}

export const verifyWorker = async (workerId) =>
  normalizeWorker(
    await request(`/api/workers/admin/${workerId}/verify`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const rejectWorker = async (workerId) =>
  normalizeWorker(
    await request(`/api/workers/admin/${workerId}/reject`, {
      method: "PATCH",
      headers: buildHeaders({}, true)
    })
  )

export const getMyBookings = async () =>
  (await request("/api/bookings/my-bookings", {
    headers: buildHeaders({}, true)
  })).map(normalizeBooking)

export const getMyBookingRequests = async () =>
  (await request("/api/bookings/my-requests", {
    headers: buildHeaders({}, true)
  })).map(normalizeBooking)

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

export const createTaskRating = async (taskId, ratingData) =>
  request(`/api/ratings/task/${taskId}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, true),
    body: JSON.stringify(ratingData)
  })

export const getWorkerRatings = async (workerId) =>
  await request(`/api/ratings/worker/${workerId}`, {
    headers: buildHeaders()
  })

export const getMyNotifications = async () =>
  (await request("/api/notifications", {
    headers: buildHeaders({}, true)
  })).map(normalizeNotification)

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




export const getRoadRoute = async ({ startLat, startLng, endLat, endLng }) => {
  if (![startLat, startLng, endLat, endLng].every((value) => Number.isFinite(Number(value)))) {
    throw new Error("إحداثيات المسار غير صالحة")
  }

  const normalizedStartLat = Number(startLat)
  const normalizedStartLng = Number(startLng)
  const normalizedEndLat = Number(endLat)
  const normalizedEndLng = Number(endLng)

  if (OPENROUTESERVICE_API_KEY) {
    const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: OPENROUTESERVICE_API_KEY
      },
      body: JSON.stringify({
        coordinates: [
          [normalizedStartLng, normalizedStartLat],
          [normalizedEndLng, normalizedEndLat]
        ]
      })
    })

    if (!response.ok) {
      throw new Error("تعذر حساب مسافة الطريق")
    }

    const data = await response.json()
    const feature = Array.isArray(data?.features) ? data.features[0] : null
    const segment = Array.isArray(feature?.properties?.segments) ? feature.properties.segments[0] : null
    const coordinates = Array.isArray(feature?.geometry?.coordinates) ? feature.geometry.coordinates : []

    return {
      distanceKm: Number(((segment?.distance || 0) / 1000).toFixed(2)),
      durationMinutes: Number(((segment?.duration || 0) / 60).toFixed(0)),
      coordinates: coordinates.map(([lng, lat]) => [lat, lng])
    }
  }

  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson"
  })
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${normalizedStartLng},${normalizedStartLat};${normalizedEndLng},${normalizedEndLat}?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error("تعذر حساب مسافة الطريق")
  }

  const data = await response.json()
  const route = Array.isArray(data?.routes) ? data.routes[0] : null

  if (!route) {
    throw new Error("لا يوجد مسار طريق متاح بين الموقعين")
  }

  return {
    distanceKm: Number(((route.distance || 0) / 1000).toFixed(2)),
    durationMinutes: Number(((route.duration || 0) / 60).toFixed(0)),
    coordinates: Array.isArray(route.geometry?.coordinates)
      ? route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
      : []
  }
}
