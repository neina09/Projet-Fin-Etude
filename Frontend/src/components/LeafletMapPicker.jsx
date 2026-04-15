import { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import { getRoadRoute } from "../api"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const defaultCenter = [18.0735, -15.9582]

function ChangeView({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])

  return null
}

function ClickHandler({ onPick, isListView = false }) {
  useMapEvents({
    click: async (event) => {
      if (isListView) return

      const lat = event.latlng.lat
      const lng = event.latlng.lng

      let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "ar"
            }
          }
        )

        if (response.ok) {
          const data = await response.json()
          address = data?.display_name?.trim() || address
        }
      } catch {}

      onPick?.({ lat, lng, address })
    }
  })

  return null
}

export default function LeafletMapPicker({
  onLocationSelect,
  initialLocation = null,
  isListView = false,
  markers = [],
  height = "320px",
  showCurrentLocation = false,
  taskLocation = null,
  taskLabel = "موقع المهمة",
  userLabel = "موقعك الحالي",
  onDistanceChange
}) {
  const [selectedPosition, setSelectedPosition] = useState(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  )
  const [isLocating, setIsLocating] = useState(false)
  const [userPosition, setUserPosition] = useState(null)
  const [locationError, setLocationError] = useState("")
  const [routePath, setRoutePath] = useState([])
  const [routeDurationMinutes, setRouteDurationMinutes] = useState(null)

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setSelectedPosition([initialLocation.lat, initialLocation.lng])
    }
  }, [initialLocation])

  useEffect(() => {
    if (!showCurrentLocation) {
      setUserPosition(null)
      setLocationError("")
      setRoutePath([])
      setRouteDurationMinutes(null)
    }
  }, [showCurrentLocation])

  useEffect(() => {
    if (!showCurrentLocation || !userPosition || !taskLocation?.lat || !taskLocation?.lng) {
      onDistanceChange?.(null)
      setRoutePath([])
      setRouteDurationMinutes(null)
      return
    }

    let cancelled = false

    getRoadRoute({
      startLat: userPosition[0],
      startLng: userPosition[1],
      endLat: taskLocation.lat,
      endLng: taskLocation.lng
    })
      .then((route) => {
        if (cancelled) return

        setRoutePath(Array.isArray(route.coordinates) ? route.coordinates : [])
        setRouteDurationMinutes(route.durationMinutes ?? null)
        onDistanceChange?.(route.distanceKm ?? null)
        setLocationError("")
      })
      .catch((error) => {
        if (cancelled) return

        setRoutePath([])
        setRouteDurationMinutes(null)
        onDistanceChange?.(null)
        setLocationError(error.message || "تعذر حساب مسافة الطريق")
      })

    return () => {
      cancelled = true
    }
  }, [onDistanceChange, showCurrentLocation, taskLocation, userPosition])

  useEffect(() => {
    const shouldAutoLocate =
      navigator.geolocation &&
      ((!isListView && !initialLocation) || showCurrentLocation)

    if (!shouldAutoLocate) return

    setIsLocating(true)
    setLocationError("")
    const timeoutId = setTimeout(() => setIsLocating(false), 10000)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const pos = [lat, lng]

        if (showCurrentLocation) {
          setUserPosition(pos)
        }

        if (!isListView && !initialLocation) {
          setSelectedPosition(pos)
        }

        let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "ar" } }
          )
          if (response.ok) {
            const data = await response.json()
            address = data?.display_name?.trim() || address
          }
        } catch {}

        clearTimeout(timeoutId)
        setIsLocating(false)

        if (!showCurrentLocation) {
          onLocationSelect?.({ lat, lng, address })
        }
      },
      () => {
        clearTimeout(timeoutId)
        setIsLocating(false)
        if (showCurrentLocation) {
          setLocationError("تعذر الوصول إلى موقعك الحالي")
        }
      },
      { timeout: 8000 }
    )
  }, [initialLocation, isListView, onLocationSelect, showCurrentLocation])

  const taskPosition = taskLocation?.lat && taskLocation?.lng
    ? [taskLocation.lat, taskLocation.lng]
    : null

  const center = useMemo(() => {
    if (showCurrentLocation && userPosition) return userPosition
    if (taskPosition) return taskPosition

    if (isListView && markers.length > 0) {
      return [markers[0].position.lat, markers[0].position.lng]
    }

    if (selectedPosition) return selectedPosition

    return defaultCenter
  }, [isListView, markers, selectedPosition, showCurrentLocation, taskPosition, userPosition])

  const zoom = selectedPosition || showCurrentLocation || taskPosition ? 15 : 12
  return (
    <div className="relative overflow-hidden rounded-2xl border border-surface-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={center} zoom={zoom} />

        <ClickHandler
          isListView={isListView}
          onPick={(location) => {
            setSelectedPosition([location.lat, location.lng])
            onLocationSelect?.(location)
          }}
        />

        {!isListView && selectedPosition && !taskPosition && (
          <Marker position={selectedPosition}>
            <Popup>موقع المهمة</Popup>
          </Marker>
        )}

        {taskPosition && (
          <Marker position={taskPosition}>
            <Popup>{taskLabel}</Popup>
          </Marker>
        )}

        {showCurrentLocation && userPosition && (
          <Marker position={userPosition}>
            <Popup>{userLabel}</Popup>
          </Marker>
        )}

        {showCurrentLocation && routePath.length > 1 && (
          <Polyline
            positions={routePath}
            pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.9 }}
          />
        )}

        {isListView &&
          markers.map((marker, index) => (
            <Marker
              key={`${marker.title}-${index}`}
              position={[marker.position.lat, marker.position.lng]}
              eventHandlers={{
                click: marker.onClick
              }}
            >
              <Popup>{marker.title}</Popup>
            </Marker>
          ))}
      </MapContainer>

      {isLocating && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-100 bg-white p-6 shadow-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-100 border-t-primary" />
            <p className="text-sm font-bold text-surface-900">جاري تحديد موقعك تلقائيًا...</p>
            <button
              type="button"
              onClick={() => setIsLocating(false)}
              className="mt-2 text-xs text-surface-400 underline hover:text-primary"
            >
              تجاهل والبحث يدويًا
            </button>
          </div>
        </div>
      )}

      {showCurrentLocation && (
        <div className="pointer-events-none absolute right-3 top-3 z-[1000] flex max-w-[280px] flex-col gap-2">
          {routePath.length > 1 && (
            <div className="rounded-2xl border border-blue-100 bg-white/95 px-4 py-3 text-right shadow-lg backdrop-blur-sm">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">مسافة الطريق</p>
              <p className="mt-1 text-sm font-bold text-surface-900">
                {onDistanceChange ? "تم حساب الطريق إلى المهمة" : "المسار جاهز"}
              </p>
              {routeDurationMinutes !== null && (
                <p className="mt-1 text-xs font-bold text-surface-500">
                  زمن تقريبي: {routeDurationMinutes} دقيقة
                </p>
              )}
            </div>
          )}

          {locationError && (
            <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 text-right text-xs font-bold text-amber-700 shadow-lg backdrop-blur-sm">
              {locationError}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
