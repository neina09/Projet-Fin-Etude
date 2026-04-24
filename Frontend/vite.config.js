import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8081",
      "/auth": "http://127.0.0.1:8081",
      "/users": "http://127.0.0.1:8081",
      "/uploads": "http://127.0.0.1:8081",
    },
  },
  build: {
    sourcemap: false,
    target: "es2020",
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes(`${"node_modules"}/react/`)) {
            return "react-vendor"
          }
          if (id.includes("leaflet") || id.includes("react-leaflet") || id.includes("@react-google-maps")) {
            return "maps-vendor"
          }
          if (id.includes("framer-motion")) {
            return "motion-vendor"
          }
          if (id.includes("recharts")) {
            return "charts-vendor"
          }
          if (id.includes("lucide-react") || id.includes("react-icons")) {
            return "icons-vendor"
          }
        }
      }
    }
  }
})
