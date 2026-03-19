import React from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const testimonials = [
  {
    name: "Ahmed Ould Salem",
    role: "Homeowner",
    text: "I found a plumber in less than 10 minutes! Incredible service, very professional.",
    rating: 5,
    avatar: "AO",
  },
  {
    name: "Fatima Mint Cheikh",
    role: "Business Owner",
    text: "The workers are verified and reliable. I use Chghloni every week for my shop.",
    rating: 5,
    avatar: "FM",
  },
  {
    name: "Mohamed Lemine",
    role: "Tasker",
    text: "Since I joined as a Tasker, my income doubled. The platform is easy to use بسهولة.",
    rating: 5,
    avatar: "ML",
  },
]

function Testimonials() {
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
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl font-extrabold text-[#004384]">
            What People Say 💬
          </h2>
          <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">
            Real reviews from real users who use Chghloni every day.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative p-6 rounded-2xl cursor-pointer
              bg-[#FCFDFE] border border-gray-100
              hover:border-[#004384]/20 shadow-sm hover:shadow-xl
              transition-colors duration-300"
            >
              {/* Big quote mark */}
              <span className="absolute top-4 right-5 text-5xl font-black
                text-gray-100 leading-none select-none">"</span>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.15 + j * 0.05 + 0.3 }}
                  >
                    <Star size={14} className="text-[#FFB909] fill-[#FFB909]" />
                  </motion.div>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>

              {/* User */}
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-full bg-[#004384]
                  flex items-center justify-center
                  text-xs font-bold text-white flex-shrink-0"
                >
                  {t.avatar}
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-[#004384]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials