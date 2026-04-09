import React, { useState } from "react"
import { Star, MapPin, Heart, Wrench, User, ShieldCheck } from "lucide-react"

const SPEC_ICON = {
  Plumber: "🔧",
  Electrician: "⚡",
  Painter: "🎨",
  Cleaner: "✦",
}

const SPEC_TRANSLATE = {
  Plumber: "سباك",
  Electrician: "كهربائي",
  Painter: "دهان",
  Cleaner: "عامل نظافة",
}

function Stars({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? "text-[#FFB909] fill-[#FFB909] drop-shadow-[0_0_5px_#FFB909]" : "text-slate-300"}
        />
      ))}
    </div>
  )
}

export default function WorkerCard({ worker, onHire }) {
  const [saved, setSaved] = useState(false)

  const name = worker.name;
  const img = worker.imageUrl || worker.img;
  const available = worker.availability === 'AVAILABLE' || worker.available === true;
  const rating = worker.averageRating || worker.rating || 0;
  const reviews = worker.reviews || 0;
  const price = worker.salary || worker.price || 0;
  const specialty = worker.job || worker.specialty || "";
  const location = worker.address || worker.location || "";

  return (
    <div className="glass-squircle !p-0 group flex flex-col h-full border-white/40 hover:border-[#7000FF] bg-white/60 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      {/* ── Photo Section ── */}
      <div className="relative h-56 overflow-hidden p-4 pb-0 z-10">
        <div className="w-full h-full relative rounded-t-[1.5rem] rounded-b-xl overflow-hidden bg-[#F4F7FD] shadow-inner">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={e => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'W')}&size=400&background=F4F7FD&color=7000FF&font-size=0.35&bold=true`
            }}
          />
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B19]/80 via-[#070B19]/10 to-transparent" />
          
          {/* Status badge */}
          <div className="absolute top-3 end-3 flex flex-col gap-2 z-10">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 shadow-lg ${
                available
                ? "bg-[#00F0FF]/90 text-[#070B19]"
                : "bg-[#1E293B]/80 text-white"
              }`}>
              {available ? "متاح للعمل" : "في مهمة"}
            </span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setSaved(!saved) }}
            className={`absolute top-3 start-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-300 z-10 ${
              saved ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]" : "bg-[#070B19]/30 text-white hover:bg-[#070B19]/50"
            }`}
          >
            <Heart size={18} className={saved ? "fill-white" : ""} />
          </button>

          {/* Elite Verification Badge */}
          {rating >= 4.5 && (
            <div className="absolute bottom-4 end-4 bg-white backdrop-blur-xl px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(112,0,255,0.3)] flex items-center gap-2 z-10">
              <ShieldCheck size={16} className="text-[#7000FF]" />
              <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">موثق 2026</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content Body ── */}
      <div className="p-6 flex flex-col flex-1 z-10 relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-xl font-black text-[#1E293B] tracking-tight leading-none mb-2.5">
               {name}
            </h3>
            <div className="flex items-center gap-2">
               <Stars rating={rating} />
               <span className="text-xs font-bold text-[#64748B]">({reviews} مراجعة)</span>
            </div>
          </div>
          <div className="text-end">
             <div className="text-[#7000FF] font-black text-2xl leading-none tracking-tighter drop-shadow-[0_0_8px_rgba(112,0,255,0.2)]">{price}</div>
             <div className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mt-1">MRU/ساعة</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#4B00D1]/10 text-[#4B00D1] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#4B00D1]/20">
            {SPEC_ICON[specialty] || "🛠️"} {SPEC_TRANSLATE[specialty] || specialty}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/80 text-[#64748B] px-3.5 py-1.5 rounded-full text-xs font-bold border border-white">
            <MapPin size={14} className="text-[#00B0FF]" />
            {location || "المدينة غير محددة"}
          </span>
        </div>

        <div className="mt-auto pt-6 border-t border-[#1E293B]/5 flex items-center gap-3">
            <button 
              onClick={() => onHire?.(worker)}
              disabled={!available}
              className={`flex-1 h-12 rounded-[1rem] font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                available ? "btn-2026 text-[#070B19]" : "bg-[#1E293B]/5 text-[#64748B] cursor-not-allowed border outline-none"
              }`}
            >
              <Wrench size={18} />
              {available ? "تفويض المهمة" : "غير متوفر"}
            </button>
            <button className="w-12 h-12 bg-white border border-[#1E293B]/10 text-[#64748B] hover:text-[#7000FF] hover:border-[#7000FF] hover:shadow-[0_0_15px_rgba(112,0,255,0.2)] rounded-[1rem] flex items-center justify-center transition-all bg-white">
              <User size={20} />
            </button>
        </div>
      </div>
    </div>
  )
}