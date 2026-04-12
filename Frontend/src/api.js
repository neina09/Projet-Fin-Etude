// src/api.js
const BASE_URL = "http://localhost:8080"

const getToken = () => localStorage.getItem("token")

// ======= Auth =======
export const registerUser = async (username, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export const verifyUser = async (email, verificationCode) => {
  const response = await fetch(`${BASE_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, verificationCode })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

export const resendCode = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/resend?email=${email}`, {
    method: "POST"
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

// ======= User =======
export const getMe = async () => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${BASE_URL}/users/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

export const updateProfile = async (username) => {
  const response = await fetch(`${BASE_URL}/users/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify({ username })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export const deleteAccount = async () => {
  const response = await fetch(`${BASE_URL}/users/delete`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` }
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

// ======= Tasks =======
export const getOpenTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks/open`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export const getMyTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks/my`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(taskData)
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}