import React from 'react'
import { motion } from 'framer-motion'
import { Search, Star, ShieldCheck, Zap, MapPin, MessageCircle } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const services = [
  {
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-500/10 group-hover:bg-blue-500/20",
    title: "Find Skilled Workers",
    description: "Browse verified local workers by skill, rating, and availability.",
  },
  {
    icon: Star,
    color: "text-[#FFB909]",
    bg: "bg-[#FFB909]/10 group-hover:bg-[#FFB909]/20",
    title: "Ratings & Reviews",
    description: "Read honest reviews from real clients before hiring anyone.",
  },
  {
    icon: ShieldCheck,
    color: "text-green-500",
    bg: "bg-green-500/10 group-hover:bg-green-500/20",
    title: "Verified Profiles",
    description: "Every worker is verified so you can hire with full confidence.",
  },
  {
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-400/10 group-hover:bg-orange-400/20",
    title: "Fast Matching",
    description: "Get matched with the right worker for your job instantly.",
  },
  {
    icon: MapPin,
    color: "text-pink-500",
    bg: "bg-pink-500/10 group-hover:bg-pink-500/20",
    title: "Local & Nearby",
    description: "Find workers close to you based on your location.",
  },
  {
    icon: MessageCircle,
    color: "text-teal-500",
    bg: "bg-teal-500/10 group-hover:bg-teal-500/20",
    title: "Direct Messaging",
    description: "Chat directly with workers before hiring.",
  },
]

function ServicesCards() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            What we offer
          </p>
          <h2 className="text-4xl font-extrabold text-[#004384]">
            Everything you need,{" "}
            <span className="text-blue-400">in one place</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-sm mx-auto text-sm leading-relaxed">
            A simple platform connecting those who need work done with skilled local workers.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-[#FCFDFE]
                border border-gray-100 hover:border-[#004384]/20
                shadow-sm hover:shadow-xl
                transition-colors duration-300
                cursor-pointer overflow-hidden"
              >
                {/* Watermark number */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="absolute top-4 right-5 text-5xl font-black text-gray-100 select-none leading-none"
                >
                  {i + 1}
                </motion.span>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                  transition={{
                    delay: i * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className={`w-12 h-12 flex items-center justify-center
                    rounded-xl mb-4 transition-colors duration-300 ${service.bg}`}
                >
                  <Icon size={22} className={service.color} />
                </motion.div>

                {/* Text */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="text-base font-bold text-[#004384] mb-2"
                >
                  {service.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.1 + 0.35 }}
                  className="text-sm text-gray-400 leading-relaxed"
                >
                  {service.description}
                </motion.p>

              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default ServicesCards