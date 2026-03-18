import React from 'react'
import bg from '../assets/image.jpg'
import { Wrench, Hammer, Truck, Brush, TreePine, Home, Settings } from "lucide-react"

function Contant() {
  const services = [
    { name: "Assembly",     icon: Wrench,   color: "group-hover:text-blue-400",   border: "hover:border-blue-400/40"   },
    { name: "Mounting",     icon: Hammer,   color: "group-hover:text-yellow-400", border: "hover:border-yellow-400/40" },
    { name: "Moving",       icon: Truck,    color: "group-hover:text-green-400",  border: "hover:border-green-400/40"  },
    { name: "Cleaning",     icon: Brush,    color: "group-hover:text-pink-400",   border: "hover:border-pink-400/40"   },
    { name: "Outdoor",      icon: TreePine, color: "group-hover:text-teal-400",   border: "hover:border-teal-400/40"   },
    { name: "Home Repairs", icon: Home,     color: "group-hover:text-orange-400", border: "hover:border-orange-400/40" },
    { name: "Repairing",    icon: Settings, color: "group-hover:text-purple-400", border: "hover:border-purple-400/40" },
  ]

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative z-10 text-center text-white px-6 max-w-4xl w-full mx-auto py-20">


        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5
          tracking-tight letter-spacing-tight">
          Find Trusted Workers
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">
            or Showcase Your Skills
          </span>
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base text-white/45 mb-8 leading-relaxed max-w-md mx-auto">
          Connect with skilled local workers — simple, fast, and reliable.
        </p>

    {/* Buttons */}
<div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
  <button className="inline-flex items-center justify-center gap-2
    bg-blue-600 hover:bg-blue-700 active:scale-95 px-7 py-3 rounded-full
    text-sm font-semibold transition-all
    shadow-[0_4px_20px_rgba(37,99,235,0.5)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.65)]
    hover:-translate-y-0.5">
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    Find a Worker
  </button>

  <button className="inline-flex items-center justify-center gap-2
    bg-transparent hover:bg-white/7 border border-white/18 hover:border-white/38
    active:scale-95 px-7 py-3 rounded-full
    text-sm font-medium transition-all text-white/60 hover:text-white
    hover:-translate-y-0.5">
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
    Join as a Worker
  </button>
</div>

        {/* Services label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25 mb-3">
          Popular services
        </p>

        {/* Services chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <div
                key={i}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-full
                  bg-white/[0.04] border border-white/10 ${service.border}
                  cursor-pointer transition-all duration-250 hover:-translate-y-0.5
                  text-white/55 hover:text-white/90 text-xs font-medium`}
              >
                <Icon size={13} className={`transition-colors duration-250 ${service.color}`} />
                {service.name}
              </div>
            )
          })}
        </div>

      </div>
    </section>
    
  )
}

export default Contant