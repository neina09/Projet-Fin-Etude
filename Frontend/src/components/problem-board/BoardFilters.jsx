import React, { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useLanguage } from "../../i18n/LanguageContext"

export default function BoardFilters({ searchType, setSearchType, searchQuery, setSearchQuery }) {
  const { t } = useLanguage()
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Sync local search with external changes (e.g. clearing filters)
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  // Debounce the search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch)
      }
    }, 500) // 500ms debounce
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery, searchQuery])

  useEffect(() => {
    if (searchType !== "keyword") {
      setSearchType("keyword")
    }
  }, [searchType, setSearchType])

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-sm transition-all focus-within:border-blue-200">
      <div className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={t("problemBoard.searchPlaceholder") || "ابحث بكلمة من المهمة أو بالمهنة أو بالعنوان"}
          className="h-10 w-full rounded-xl border border-slate-100 bg-white pr-10 pl-4 text-xs font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:bg-white"
        />
      </div>
    </div>
  )
}
