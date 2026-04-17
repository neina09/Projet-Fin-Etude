export function previewUrl(file) {
  return file ? URL.createObjectURL(file) : ""
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({ image, url, width: image.width, height: image.height })
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("تعذر قراءة الصورة المختارة."))
    }

    image.src = url
  })
}

export async function combineIdentityFiles(frontFile, backFile) {
  if (!frontFile && !backFile) return null
  if (frontFile && !backFile) return frontFile
  if (!frontFile && backFile) return backFile

  const front = await readImageDimensions(frontFile)
  const back = await readImageDimensions(backFile)

  const padding = 32
  const labelHeight = 48
  const canvas = document.createElement("canvas")
  const width = Math.max(front.width, back.width) + padding * 2
  const height = front.height + back.height + padding * 3 + labelHeight * 2

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.fillStyle = "#111827"
  context.font = "bold 24px Arial"
  context.direction = "rtl"
  context.textAlign = "right"

  const labelX = width - padding
  let currentY = padding

  context.fillText("البطاقة - الوجه الأمامي", labelX, currentY + 28)
  currentY += labelHeight
  context.drawImage(front.image, (width - front.width) / 2, currentY)
  currentY += front.height + padding

  context.fillText("البطاقة - الوجه الخلفي", labelX, currentY + 28)
  currentY += labelHeight
  context.drawImage(back.image, (width - back.width) / 2, currentY)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92))

  URL.revokeObjectURL(front.url)
  URL.revokeObjectURL(back.url)

  if (!blob) {
    throw new Error("تعذر تجهيز صور البطاقة للرفع.")
  }

  return new File([blob], "identity-front-back.jpg", { type: "image/jpeg" })
}
