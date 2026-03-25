import React from 'react'
import bg from '../assets/image.jpg'
import { motion } from 'framer-motion'
import { Wrench, Hammer, Truck, Brush, TreePine, Home, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

const services = [
  { name: "تركيب",        icon: Wrench,   color: "group-hover:text-blue-400",   border: "hover:border-blue-400/40",   glow: "group-hover:bg-blue-400/10"   },
  { name: "تثبيت",        icon: Hammer,   color: "group-hover:text-yellow-400", border: "hover:border-yellow-400/40", glow: "group-hover:bg-yellow-400/10" },
  { name: "نقل",          icon: Truck,    color: "group-hover:text-green-400",  border: "hover:border-green-400/40",  glow: "group-hover:bg-green-400/10"  },
  { name: "تنظيف",        icon: Brush,    color: "group-hover:text-pink-400",   border: "hover:border-pink-400/40",   glow: "group-hover:bg-pink-400/10"   },
  { name: "خارجي",        icon: TreePine, color: "group-hover:text-teal-400",   border: "hover:border-teal-400/40",   glow: "group-hover:bg-teal-400/10"   },
  { name: "إصلاح المنزل", icon: Home,     color: "group-hover:text-orange-400", border: "hover:border-orange-400/40", glow: "group-hover:bg-orange-400/10" },
  { name: "صيانة",        icon: Settings, color: "group-hover:text-purple-400", border: "hover:border-purple-400/40", glow: "group-hover:bg-purple-400/10" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" }
  })
}

function Hero() {
  const navigate = useNavigate()

  return (
    <section
      dir="rtl"
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative z-10 text-center text-white px-6 max-w-5xl w-full mx-auto py-20">

        {/* Title */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          ابحث عن عمال موثوقين
          <br />
          <span className="bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">
            أو اعرض مهاراتك
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-sm md:text-base text-white/45 mb-8 leading-relaxed max-w-md mx-auto"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تواصل مع عمال محليين — بسرعة وسهولة وموثوقية.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2
              bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-full
              text-sm font-semibold transition-colors
              shadow-[0_4px_20px_rgba(37,99,235,0.5)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.65)]"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            ابحث عن عامل
          </motion.button>

          {/* ✅ يوجه إلى صفحة BecomeWorker */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/become-worker")}
            className="inline-flex items-center justify-center gap-2
              bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40
              px-7 py-3 rounded-full text-sm font-medium transition-colors text-white/60 hover:text-white"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            انضم كعامل
          </motion.button>
        </motion.div>

        {/* Services label */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25 mb-5"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          الخدمات الشائعة
        </motion.p>

        {/* Services grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 max-w-3xl mx-auto">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" animate="visible" custom={4 + i * 0.5}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex flex-col items-center justify-center gap-2
                  px-2 py-4 rounded-2xl cursor-pointer
                  bg-white/[0.04] border border-white/10 ${service.border} ${service.glow}
                  transition-colors duration-300`}
              >
                <Icon size={28} className={`text-white/40 transition-colors duration-300 ${service.color}`} />
                <span
                  className="text-[11px] font-medium text-white/50 group-hover:text-white/90 transition-colors duration-300 leading-tight text-center"
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {service.name}
                </span>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Hero