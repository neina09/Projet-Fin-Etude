import React from "react"
import { useLanguage } from "../i18n/LanguageContext"

export default function Logo({ className = "", onClick, size = "lg", footer = false }) {
  const { t } = useLanguage()

  const sizes = {
    sm: { img: "h-5 w-auto",  text: "text-base" },
    md: { img: "h-8 w-auto",  text: "text-lg"   },
    lg: { img: "h-16 w-auto", text: "text-xl"   }
  }

  const current = sizes[size] || sizes.md

  return (
    <div
      className={`inline-flex items-center gap-2 ${footer ? "justify-center w-full" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      <img
        src="/logo.png"
        alt={t("common.appNameLatin")}
        className={`${current.img} shrink-0 object-contain mix-blend-multiply`}
        loading="eager"
        decoding="async"
        style={{ background: "transparent" }}
      />
      <div className="flex items-baseline gap-2">
        <span className={`whitespace-nowrap font-extrabold leading-none text-slate-900 ${footer ? "text-xl" : current.text}`}>
          عمالك
        </span>
        {size !== "sm" && (
          <span className="hidden whitespace-nowrap text-[11px] font-semibold tracking-wide text-slate-400 sm:inline">
            | منصة الخبراء
          </span>
        )}
      </div>
    </div>
  )
}