import React from "react"
import { Briefcase, ChevronDown, MapPin, Search, Zap } from "lucide-react"

export const SEARCH_TYPE_META = {
  keyword: {
    icon: Search,
    label: "كلمة مفتاحية",
    placeholder: "ابحث في تفاصيل المهمة..."
  },
  address: {
    icon: MapPin,
    label: "نطاق جغرافي",
    placeholder: "ابحث في موقع محدد..."
  },
  profession: {
    icon: Briefcase,
    label: "تصنيف فني",
    placeholder: "ابحث عن مهنة فنية..."
  }
}

export default function BoardFilters({ searchType, setSearchType, searchQuery, setSearchQuery }) {
  const ActiveSearchIcon = SEARCH_TYPE_META[searchType]?.icon || Search

  return (
    <div className="grid grid-cols-1 gap-4 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="relative z-10">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#1d4ed8]">
          <Zap size={16} />
        </div>
        <select
          value={searchType}
          onChange={(event) => setSearchType(event.target.value)}
          className="h-14 w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 pr-12 pl-10 text-sm font-black text-slate-700 outline-none transition-all focus:border-blue-500/30 focus:bg-white"
        >
          {Object.entries(SEARCH_TYPE_META).map(([value, item]) => (
            <option key={value} value={value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      </div>

      <div className="relative z-10">
        <ActiveSearchIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" size={18} />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={SEARCH_TYPE_META[searchType]?.placeholder}
          className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 pr-12 pl-4 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500/30 focus:bg-white"
        />
      </div>
    </div>
  )
}
