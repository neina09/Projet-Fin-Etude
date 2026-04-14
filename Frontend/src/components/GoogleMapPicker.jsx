import React, { useCallback, useRef, useState, useEffect } from "react"
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api"
import { Search, Navigation } from "lucide-react"

const libraries = ["places"]
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem"
}

const defaultCenter = {
  lat: 33.5731, // Casablanca default
  lng: -7.5898
}

export default function GoogleMapPicker({ 
  onLocationSelect = null, 
  initialLocation = null,
  isListView = false,
  markers = [] 
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries
  })

  const [marker, setMarker] = useState(initialLocation || null)
  const [map, setMap] = useState(null)
  const [autocomplete, setAutocomplete] = useState(null)
  const [isLocating, setIsLocating] = useState(false)

  // Sync with external location updates (e.g. from ProblemForm auto-detection)
  useEffect(() => {
    if (initialLocation && (!marker || (initialLocation.lat !== marker.lat || initialLocation.lng !== marker.lng))) {
      setMarker(initialLocation)
      if (map) {
        map.panTo(initialLocation)
        map.setZoom(15)
      }
    }
  }, [initialLocation, map])

  // Auto-detect location on load
  const loadUserLocation = useCallback((mapInstance) => {
    if (!isListView && !initialLocation && navigator.geolocation) {
      setIsLocating(true)
      
      // Safety timeout to prevent stuck overlay
      const timeoutId = setTimeout(() => setIsLocating(false), 10000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const pos = { lat, lng }
          
          setMarker(pos)
          if (mapInstance) {
            mapInstance.panTo(pos)
            mapInstance.setZoom(15)
          }
          
          // Reverse geocode
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: pos }, (results, status) => {
            clearTimeout(timeoutId)
            setIsLocating(false)
            if (status === "OK" && results[0] && onLocationSelect) {
              onLocationSelect({
                lat,
                lng,
                address: results[0].formatted_address
              })
            }
          })
        },
        () => {
          clearTimeout(timeoutId)
          setIsLocating(false)
          console.log("Geolocation permission denied.")
        },
        { timeout: 8000 }
      )
    }
  }, [isListView, initialLocation, onLocationSelect])

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance)
    loadUserLocation(mapInstance)
  }, [loadUserLocation])

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setMarker({ lat, lng })
        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: place.formatted_address || place.name
          })
        }
        if (map) {
          map.panTo({ lat, lng })
          map.setZoom(15)
        }
      }
    }
  }

  const handleLocateMe = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setMarker(pos)
        map.panTo(pos)
        map.setZoom(15)
        
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results[0] && onLocationSelect) {
            onLocationSelect({
              lat: pos.lat,
              lng: pos.lng,
              address: results[0].formatted_address
            })
          }
        })
      })
    }
  }

  const onMapClick = useCallback((event) => {
    if (isListView) return
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    setMarker({ lat, lng })
    
    if (onLocationSelect) {
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          onLocationSelect({
            lat,
            lng,
            address: results[0].formatted_address
          })
        }
      })
    }
  }, [onLocationSelect, isListView])

  if (loadError) return <div className="p-4 bg-red-50 text-red-700 rounded-xl">خطأ في تحميل الخريطة</div>
  if (!apiKey) return <div className="p-8 border-dashed border-2 border-surface-200 text-center rounded-3xl bg-surface-50 text-surface-500">يرجى إضافة مفتاح Google Maps API</div>
  if (!isLoaded) return <div className="h-[300px] bg-surface-50 animate-pulse rounded-2xl flex items-center justify-center">جاري تحميل الخريطة...</div>

  const mapCenter = isListView && markers.length > 0 ? markers[0].position : (marker || defaultCenter)

  return (
    <div className="h-full w-full space-y-4">
      {!isListView && (
        <Autocomplete onLoad={(ac) => setAutocomplete(ac)} onPlaceChanged={onPlaceChanged}>
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={16} />
            <input type="text" placeholder="ابحث عن موقع..." className="saas-input h-12 border-surface-200 pr-11" />
          </div>
        </Autocomplete>
      )}

      <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-surface-200 shadow-sm">
        <GoogleMap
          onLoad={onLoad}
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={isListView ? 12 : 13}
          onClick={onMapClick}
          options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
        >
          {isListView ? (
            markers.map((m, i) => <Marker key={i} position={m.position} title={m.title} onClick={m.onClick} />)
          ) : (
            marker && <Marker position={marker} />
          )}
        </GoogleMap>

        {isLocating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
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

        {!isListView && (
          <button
            type="button"
            onClick={handleLocateMe}
            className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-xl border border-surface-200 hover:bg-surface-50 active:scale-95 z-20"
          >
            <Navigation size={18} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  )
}
