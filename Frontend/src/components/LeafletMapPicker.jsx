import { useCallback, useEffect, useMemo, useState } from "react"
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
  }, [center, map, zoom])

  return null
}

function ClickHandler({ isListView = false, onPick, setIsLocating }) {
  useMapEvents({
    click: async (event) => {
      if (isListView) return

      const lat = event.latlng.lat
      const lng = event.latlng.lng
      setIsLocating(true)

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
      } catch (error) {
        console.warn("Reverse geocoding failed", error)
      } finally {
        setIsLocating(false)
      }

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
  const [selectedPosition, setSelectedPosition] = useState(initialLocation ? [initialLocation.lat, initialLocation.lng] : null)
  const [isLocating, setIsLocating] = useState(false)
  const [userPosition, setUserPosition] = useState(null)
  const [locationError, setLocationError] = useState("")
  const [routePath, setRoutePath] = useState([])
  const [routeDurationMinutes, setRouteDurationMinutes] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const reverseGeocode = useCallback(async (lat, lng) => {
    const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "ar" } }
      )

      if (!response.ok) return fallbackAddress

      const data = await response.json()
      return data?.display_name?.trim() || fallbackAddress
    } catch (error) {
      console.warn("Reverse geocoding failed", error)
      return fallbackAddress
    }
  }, [])

  const taskPosition = useMemo(() => (
    taskLocation?.lat && taskLocation?.lng ? [taskLocation.lat, taskLocation.lng] : null
  ), [taskLocation])

  const syncSelectedPosition = useMemo(() => (
    initialLocation?.lat && initialLocation?.lng ? [initialLocation.lat, initialLocation.lng] : null
  ), [initialLocation])

  useEffect(() => {
    if (!syncSelectedPosition) return
    setSelectedPosition(syncSelectedPosition)
  }, [syncSelectedPosition])

  useEffect(() => {
    if (!showCurrentLocation || !userPosition || !taskPosition) {
      setRoutePath([])
      setRouteDurationMinutes(null)
      onDistanceChange?.(null)
      return
    }

    let cancelled = false
    setLocationError("")

    getRoadRoute({
      startLat: userPosition[0],
      startLng: userPosition[1],
      endLat: taskPosition[0],
      endLng: taskPosition[1]
    })
      .then((route) => {
        if (cancelled) return
        setRoutePath(Array.isArray(route.coordinates) ? route.coordinates : [])
        setRouteDurationMinutes(route.durationMinutes ?? null)
        onDistanceChange?.(route.distanceKm ?? null)
      })
      .catch((error) => {
        if (cancelled) return
        setRoutePath([])
        setRouteDurationMinutes(null)
        onDistanceChange?.(null)
        setLocationError(error.message || "تعذر حساب مسافة الطريق.")
      })

    return () => {
      cancelled = true
    }
  }, [onDistanceChange, showCurrentLocation, taskPosition, userPosition])

  useEffect(() => {
    if (!navigator.geolocation || (!(!isListView && !initialLocation) && !showCurrentLocation)) return

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        if (showCurrentLocation) setUserPosition([lat, lng])

        if (!isListView && !initialLocation) {
          setSelectedPosition([lat, lng])
          const address = await reverseGeocode(lat, lng)
          onLocationSelect?.({ lat, lng, address })
        }

        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
        setLocationError("تعذر تحديد الموقع الحالي. تأكد من تفعيل صلاحية الوصول للموقع.")
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [initialLocation, isListView, onLocationSelect, reverseGeocode, showCurrentLocation])

  const center = useMemo(() => {
    if (showCurrentLocation && userPosition) return userPosition
    if (taskPosition) return taskPosition
    if (isListView && markers.length > 0 && markers[0].position?.lat) {
      return [markers[0].position.lat, markers[0].position.lng]
    }
    if (selectedPosition) return selectedPosition
    return defaultCenter
  }, [isListView, markers, selectedPosition, showCurrentLocation, taskPosition, userPosition])

  const zoom = selectedPosition || showCurrentLocation || taskPosition ? 15 : 12

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) return

    setIsLocating(true)
    setLocationError("")

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=ar`
      )

      if (!response.ok) {
        setLocationError("تعذر تنفيذ البحث عن الموقع.")
        return
      }

      const data = await response.json()
      if (!data?.[0]) {
        setLocationError("لم يتم العثور على نتيجة مطابقة.")
        return
      }

      const lat = Number.parseFloat(data[0].lat)
      const lng = Number.parseFloat(data[0].lon)
      const address = data[0].display_name

      setSelectedPosition([lat, lng])
      onLocationSelect?.({ lat, lng, address })
    } catch (error) {
      console.warn("Search failed", error)
      setLocationError("حدث خطأ أثناء البحث عن الموقع.")
    } finally {
      setIsLocating(false)
    }
  }

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError("المتصفح الحالي لا يدعم تحديد الموقع.")
      return
    }

    setIsLocating(true)
    setLocationError("")

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const address = await reverseGeocode(lat, lng)

        setSelectedPosition([lat, lng])
        setIsLocating(false)
        onLocationSelect?.({ lat, lng, address })
      },
      () => {
        setIsLocating(false)
        setLocationError("تعذر تحديد موقعك. يرجى التأكد من تفعيل إذن الوصول للموقع.")
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  return (
    <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2">
      {!isListView && (
        <div className="relative z-[1000] flex gap-2">
          <input
            type="text"
            placeholder="ابحث عن مكان... مثل: نواكشوط، تفرغ زينة"
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-black outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                handleSearch(event)
              }
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            aria-label="بحث عن موقع"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-inner" style={{ height }}>
        <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={center} zoom={zoom} />
          <ClickHandler
            isListView={isListView}
            setIsLocating={setIsLocating}
            onPick={(location) => {
              setSelectedPosition([location.lat, location.lng])
              onLocationSelect?.(location)
            }}
          />

          {!isListView && selectedPosition && !taskPosition && (
            <Marker position={selectedPosition}>
              <Popup>الموقع المختار</Popup>
            </Marker>
          )}

          {taskPosition && (
            <Marker position={taskPosition}>
              <Popup>{taskLabel}</Popup>
            </Marker>
          )}

          {userPosition && showCurrentLocation && (
            <Marker position={userPosition}>
              <Popup>{userLabel}</Popup>
            </Marker>
          )}

          {routePath.length > 1 && (
            <Polyline positions={routePath} pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.9 }} />
          )}

          {isListView && markers.filter((marker) => marker.position?.lat).map((marker, index) => (
            <Marker
              key={index}
              position={[marker.position.lat, marker.position.lng]}
              eventHandlers={{ click: marker.onClick }}
            >
              <Popup>{marker.title}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {!isListView && (
          <button
            type="button"
            onClick={handleLocateMe}
            className="absolute bottom-4 left-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-blue-600 shadow-lg transition-all hover:bg-slate-50 active:scale-95"
            title="حدد موقعي الحالي"
            aria-label="حدد موقعي الحالي"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
          </button>
        )}

        {isLocating && (
          <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-xl">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
              <p className="text-xs font-black text-slate-900">جارٍ تحديد الموقع...</p>
            </div>
          </div>
        )}
      </div>

      {(locationError || routeDurationMinutes) && (
        <div className="space-y-2">
          {locationError && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
              {locationError}
            </p>
          )}
          {!locationError && routeDurationMinutes ? (
            <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700">
              الزمن التقديري للوصول: {routeDurationMinutes} دقيقة.
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}
