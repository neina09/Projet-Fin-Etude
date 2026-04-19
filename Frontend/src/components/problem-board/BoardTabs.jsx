import React from "react"
import { LayoutGrid } from "lucide-react"

export default function BoardTabs({ tabs, currentTab, onTabChange }) {
  return (
    <div className="flex flex-col justify-between gap-8 border-b border-white/5 pb-10 md:flex-row md:items-center">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`btn-saas whitespace-nowrap !px-8 !py-3 !text-[11px] !font-black !uppercase !tracking-widest transition-all duration-300 ${
              currentTab === item.id
                ? "btn-primary shadow-gold scale-105"
                : "!bg-[#020617] !border-white/5 !text-slate-500 hover:!border-primary/40 hover:!text-slate-300"
            }`}
          >
            {item.lbl}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 group">
        <LayoutGrid size={16} className="text-primary opacity-50 transition-transform group-hover:scale-110" />
        GRID DISCOVERY
      </div>
    </div>
  )
}
