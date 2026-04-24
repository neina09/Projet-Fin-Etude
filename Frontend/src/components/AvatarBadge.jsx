import React from "react"

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "؟"
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase()
}

export default function AvatarBadge({
  src = "",
  name = "",
  alt = "",
  className = "",
  fallbackClassName = ""
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        loading="lazy"
        decoding="async"
        className={className}
      />
    )
  }

  return (
    <div
      aria-label={alt || name || "صورة رمزية"}
      className={fallbackClassName || className}
      title={name || "مستخدم"}
    >
      {getInitials(name)}
    </div>
  )
}
