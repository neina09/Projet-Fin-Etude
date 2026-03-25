import React from "react"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"

/**
 * SearchBar Component
 * Props:
 *  - value    : string         — current search text
 *  - onChange : (str) => void  — called on every keystroke
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-row">
      <Search size={16} className="s-icon" />

      <input
        placeholder="Search workers by name or specialty…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      <div className="s-divider" />

      <button className="btn-filter">
        <SlidersHorizontal size={14} /> Filters <ChevronDown size={13} />
      </button>
    </div>
  )
}