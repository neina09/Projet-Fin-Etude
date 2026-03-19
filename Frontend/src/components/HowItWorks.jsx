import React from "react"
import { motion } from "framer-motion"
import { UserPlus, Search, MessageCircle, Star } from "lucide-react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const steps = [
  { icon: UserPlus,      title: "Sign Up",  description: "Create your free account in seconds." },
  { icon: Search,        title: "Find",     description: "Browse verified skilled workers near you." },
  { icon: MessageCircle, title: "Connect",  description: "Chat & agree on details before hiring." },
  { icon: Star,          title: "Review",   description: "Rate your experience & help the community." },
]

function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 px-6 bg-[#004384]" ref={ref}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">How it works</p>
          <h2 className="text-4xl font-extrabold text-white">Simple & Fast Process</h2>
          <p className="text-white/50 mt-3 max-w-md mx-auto text-sm leading-relaxed">
            Get your job done in just a few steps — easy, fast and reliable.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative grid md:grid-cols-4 gap-8">

          {/* Connector line */}
          <div className="hidden md:block absolute top-5 left-[12%] right-[12%] h-px
            bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.25,       // ← تأخير واضح بين كل step
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ y: -6 }}
                className="relative flex flex-col items-center text-center cursor-pointer"
              >

                {/* Icon circle */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.25 + 0.2,  // ← يظهر بعد الـ card قليلاً
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(255,185,9,0.2)" }}
                  className="relative z-10 w-10 h-10 rounded-full
                    bg-white/10 border border-white/20
                    flex items-center justify-center mb-6"
                >
                  <Icon size={18} className="text-white" />
                </motion.div>

                {/* Step number */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.25 + 0.35 }}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#FFB909] mb-2"
                >
                  Step {i + 1}
                </motion.span>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.25 + 0.4 }}
                  className="text-base font-bold text-white mb-2"
                >
                  {step.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.25 + 0.45 }}
                  className="text-sm text-white/50 leading-relaxed"
                >
                  {step.description}
                </motion.p>

              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks