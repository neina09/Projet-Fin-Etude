export const AUTH_STORAGE_KEYS = {
  token: "token",
  userInfo: "userInfo"
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.token) || ""
}

export function hasStoredSession() {
  return Boolean(getStoredToken())
}

export function storeSessionToken(token) {
  if (!token) return
  localStorage.setItem(AUTH_STORAGE_KEYS.token, token)
}

export function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token)
  localStorage.removeItem(AUTH_STORAGE_KEYS.userInfo)
}
