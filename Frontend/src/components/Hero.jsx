import React from "react"
import bg from "../assets/image.jpg"
import { Search, Play, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Hero() {
  const navigate = useNavigate()

  return (
    <section dir="rtl" className="relative min-h-[88vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={bg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-linear-to-l from-blue-950/70 via-slate-900/65 to-slate-950/65" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="section-shell relative z-10 text-center pt-12">
        <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white">
          <span className="text-white/85">10,000+ مستخدم يثقون بنا</span>
          <div className="hidden sm:flex items-center gap-1 text-yellow-300">
            <Star size={12} className="fill-yellow-300" />
            <span className="text-[11px]">4.9</span>
          </div>
        </div>

        <h1 className="text-white text-5xl md:text-6xl xl:text-8xl font-black leading-[0.95] tracking-tight">
          اكتشف الاحترافية في
          <span className="block text-blue-500">كل زاوية من منزلك</span>
        </h1>

        <p className="mt-6 text-white/80 text-lg md:text-2xl font-bold max-w-4xl mx-auto">
          أكبر منصة عربية تجمع بين العمال المهرة وأصحاب المشاريع، الجودة، الأمان، والسرعة في مكان واحد.
        </p>


        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate("/become-worker")}
            className="h-12 px-6 rounded-xl border border-white/25 bg-white/10 text-white font-black hover:bg-white/20 transition-colors"
          >
            سجل كصاحب مهنة
          </button>
          <button className="h-12 px-6 rounded-xl border border-white/15 bg-slate-900/40 text-white font-black inline-flex items-center gap-2 hover:bg-slate-900/60 transition-colors">
            <Play size={15} className="fill-white" />
            شاهد العرض
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero