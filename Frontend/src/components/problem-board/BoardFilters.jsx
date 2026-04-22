import React from "react"
import { Briefcase, ChevronDown, MapPin, Search } from "lucide-react"

export const SEARCH_TYPE_META = {
  keyword: { icon: Search, label: "كلمة مفتاحية", placeholder: "ابحث في الطلبات..." },
  address: { icon: MapPin, label: "نطاق جغرافي", placeholder: "ابحث عن موقع..." },
  profession: { icon: Briefcase, label: "تصنيف فني", placeholder: "ابحث عن مهنة..." }
}

export default function BoardFilters({ searchType, setSearchType, searchQuery, setSearchQuery }) {
  const ActiveSearchIcon = SEARCH_TYPE_META[searchType]?.icon || Search

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-sm transition-all focus-within:border-blue-200 sm:flex-row">
      <div className="relative min-w-[140px]">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-slate-100 bg-white pr-4 pl-8 text-[11px] font-black text-slate-600 outline-none transition-all shadow-sm"
        >
          {Object.entries(SEARCH_TYPE_META).map(([value, item]) => (
            <option key={value} value={value}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
      </div>

      <div className="relative flex-1">
        <ActiveSearchIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={SEARCH_TYPE_META[searchType]?.placeholder}
          className="h-10 w-full rounded-xl border border-slate-100 bg-white pr-10 pl-4 text-xs font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:bg-white"
        />
      </div>
    </div>
  )
}
