import React, { useState } from "react"
import { Star, MapPin, Heart, Wrench, User, ShieldCheck, ChevronLeft } from "lucide-react"

const SPEC_ICON = {
  Plumber: "🔧",
  Electrician: "⚡",
  Painter: "🎨",
  Cleaner: "🧹",
}

const SPEC_TRANSLATE = {
  Plumber: "سباك",
  Electrician: "كهربائي",
  Painter: "دهان",
  Cleaner: "عامل نظافة",
}

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? "text-yellow-500 fill-current" : "text-surface-200"}
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
    <article className="saas-card group overflow-hidden border-surface-200 flex flex-col h-full bg-white hover:border-primary/20 transition-all duration-300">
      {/* ── Photo Section ── */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'W')}&size=400&background=F4F7FD&color=7000FF&font-size=0.35&bold=true`
          }}
        />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm border ${
              available
              ? "bg-emerald-500 border-emerald-600 text-white"
              : "bg-surface-800 border-surface-900 text-white"
            }`}>
            {available ? "متاح للعمل" : "في مهمة"}
          </span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setSaved(!saved) }}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 z-10 ${
            saved ? "bg-red-500 text-white border-red-600" : "bg-white/40 text-surface-900 hover:bg-white"
          }`}
        >
          <Heart size={16} className={saved ? "fill-white" : ""} />
        </button>

        {/* Verification Overlay */}
        {rating >= 4.5 && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 z-10 border border-surface-100">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-surface-900">موثوق</span>
          </div>
        )}
      </div>

      {/* ── Content Body ── */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-surface-900 leading-none">
               {name}
            </h3>
            <div className="flex items-center gap-1.5">
               <Stars rating={rating} />
               <span className="text-[11px] font-bold text-surface-400">({reviews})</span>
            </div>
          </div>
          <div className="text-left">
             <div className="text-surface-900 font-black text-xl leading-none">{price}</div>
             <div className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mt-1">MRU/ساعة</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-primary-soft text-primary px-3 py-1 rounded-lg text-[11px] font-bold border border-primary/5">
            <span className="text-sm leading-none">{SPEC_ICON[specialty] || "🛠️"}</span>
            {SPEC_TRANSLATE[specialty] || specialty}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-surface-50 text-surface-500 px-3 py-1 rounded-lg text-[11px] font-bold border border-surface-100">
            <MapPin size={12} className="text-surface-300" />
            {location || "غير محدد"}
          </span>
        </div>

        <div className="mt-auto pt-5 border-t border-surface-100 flex items-center gap-2">
            <button 
              onClick={() => onHire?.(worker)}
              disabled={!available}
              className={`flex-1 btn-saas h-11 text-xs font-bold transition-all duration-300 ${
                available 
                ? "btn-primary shadow-sm hover:shadow-md active:scale-95" 
                : "bg-surface-100 text-surface-400 cursor-not-allowed border-surface-200"
              }`}
            >
              <Wrench size={16} />
              {available ? "توظيف الآن" : "غير متوفر"}
            </button>
            <button className="w-11 h-11 btn-saas btn-secondary border-surface-200 text-surface-500 hover:text-primary active:scale-95">
              <User size={18} />
            </button>
        </div>
      </div>
    </article>
  )
}