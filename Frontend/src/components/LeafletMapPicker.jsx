import { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

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
  height = "320px"
}) {
  const [selectedPosition, setSelectedPosition] = useState(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  )
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setSelectedPosition([initialLocation.lat, initialLocation.lng])
    }
  }, [initialLocation])

  // Auto-detect location
  useEffect(() => {
    if (!isListView && !initialLocation && navigator.geolocation) {
      setIsLocating(true)
      const timeoutId = setTimeout(() => setIsLocating(false), 10000)

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const pos = [lat, lng]
          
          setSelectedPosition(pos)
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
          } catch (err) {}

          clearTimeout(timeoutId)
          setIsLocating(false)
          
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address })
          }
        },
        () => {
          clearTimeout(timeoutId)
          setIsLocating(false)
        },
        { timeout: 8000 }
      )
    }
  }, [isListView, initialLocation, onLocationSelect])

  const center = useMemo(() => {
    if (isListView && markers.length > 0) {
      return [markers[0].position.lat, markers[0].position.lng]
    }

    if (selectedPosition) return selectedPosition

    return defaultCenter
  }, [isListView, markers, selectedPosition])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-surface-200">
      <MapContainer
        center={center}
        zoom={selectedPosition ? 15 : 12}
        style={{ height: height, width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={center} zoom={selectedPosition ? 15 : 12} />

        <ClickHandler
          isListView={isListView}
          onPick={(location) => {
            setSelectedPosition([location.lat, location.lng])
            onLocationSelect?.(location)
          }}
        />

        {!isListView && selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>موقع المهمة</Popup>
          </Marker>
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
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-2xl border border-surface-100">
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
    </div>
  )
}