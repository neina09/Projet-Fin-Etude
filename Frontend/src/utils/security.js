export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 64
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024

const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const PHONE_REGEX = /^(\+222|222)?[2-4][0-9]{7}$/

export function normalizePhoneNumber(value) {
  return String(value || "").replace(/\s+/g, "")
}

export function isValidMauritanianPhone(value) {
  return PHONE_REGEX.test(normalizePhoneNumber(value))
}

export function isStrongPassword(value) {
  const password = String(value || "")

  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  )
}

export function validateImageFile(file, label = "الملف") {
  if (!file) {
    throw new Error(`يرجى اختيار ${label}.`)
  }

  if (!IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error(`${label} يجب أن يكون بصيغة JPG أو PNG أو WebP فقط.`)
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(`${label} يجب ألا يتجاوز 5 ميغابايت.`)
  }

  return file
}
