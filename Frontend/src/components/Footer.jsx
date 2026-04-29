import React from "react"
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  Globe
} from "lucide-react"
import Logo from "./Logo"
import { useLanguage } from "../i18n/LanguageContext"

export default function Footer() {
  const { dir, t } = useLanguage()

  return (
    <footer
      className="relative mt-24 overflow-hidden border-t border-slate-100 bg-white lg:mt-40"
      dir={dir}
    >
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-12 lg:pt-20">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:mb-16 lg:grid-cols-12 lg:gap-12">
          
          {/* Brand */}
          <div className="space-y-5 lg:col-span-5">
            <Logo size="lg" />

            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              {t("footer.description")}
            </p>

            <div className="flex items-center gap-2.5">
              {[Facebook, Twitter, Instagram, Globe].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-blue-200 hover:bg-blue-600 hover:text-white"
                  >
                    <Icon
                      size={15}
                      className="transition-transform group-hover:scale-110"
                    />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-sm font-black text-black tracking-tight">
              {t("footer.platform")}
            </h3>

            <ul className="space-y-3">
              {t("footer.platformLinks", []).map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-sm font-black text-black tracking-tight">
              {t("footer.support")}
            </h3>

            <ul className="space-y-3">
              {t("footer.supportLinks", []).map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 lg:col-span-3">
            <h3 className="text-sm font-black text-black tracking-tight">
              {t("footer.contactUs")}
            </h3>

            <div className="space-y-3">
              <div className="group flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white">
                  <Phone size={15} />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-black">
                    {t("footer.phoneLabel")}
                  </p>

                  <p
                    className="text-sm font-bold text-slate-500"
                    dir="ltr"
                  >
                    +222 22 22 22 22
                  </p>
                </div>
              </div>

              <div className="group flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  <Mail size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-black">
                    {t("footer.emailLabel")}
                  </p>

                  <p className="truncate text-sm font-bold text-slate-500">
                    support@ommalak.mr
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 md:flex-row">
          <p className="text-xs font-semibold text-slate-500">
            © {new Date().getFullYear()} {t("common.appName")} —{" "}
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}