import React from "react"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer id="support" dir="rtl" className="mt-24 bg-surface-900 px-6 pb-10 pt-20 text-surface-200">
      <div className="section-shell grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight text-white">شغلني</h2>
          <p className="max-w-xs text-sm leading-relaxed text-surface-400">
            منصة لتنظيم العلاقة بين العملاء والعمال عبر الحجز، نشر المهام، الرسائل، والتقييمات
            في تجربة أكثر وضوحاً وقابلية للاستخدام اليومي.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
              <a key={idx} href="/auth" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:border-primary hover:bg-primary">
                <Icon size={18} className="text-surface-300" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-base font-bold text-white">المنصة</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#services" className="text-surface-400 transition-colors hover:text-white">الخدمات</a></li>
            <li><a href="#how-it-works" className="text-surface-400 transition-colors hover:text-white">كيف يعمل</a></li>
            <li><a href="#join" className="text-surface-400 transition-colors hover:text-white">انضم كعامل</a></li>
            <li><a href="/auth" className="text-surface-400 transition-colors hover:text-white">ابدأ الآن</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-base font-bold text-white">الثقة والدعم</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#support" className="text-surface-400 transition-colors hover:text-white">الدعم</a></li>
            <li><a href="mailto:support@shghlni.com" className="text-surface-400 transition-colors hover:text-white">البريد الإلكتروني</a></li>
            <li><a href="tel:+22244444444" className="text-surface-400 transition-colors hover:text-white">الهاتف</a></li>
            <li><span className="text-surface-400">الخصوصية والشروط متاحة داخل النسخة المنشورة</span></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="mb-6 text-base font-bold text-white">تواصل معنا</h3>
          <div className="space-y-4 text-sm font-medium">
            <p className="flex items-center gap-3 text-surface-400">
              <Mail size={16} className="text-primary" />
              <span>support@shghlni.com</span>
            </p>
            <p className="flex items-center gap-3 text-surface-400">
              <Phone size={16} className="text-primary" />
              <span>+222 44 44 44 44</span>
            </p>
            <p className="flex items-center gap-3 text-surface-400">
              <MapPin size={16} className="text-primary" />
              <span>نواكشوط، موريتانيا</span>
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-bold tracking-wider text-white">مسار سريع</p>
            <div className="flex">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 rounded-r-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors placeholder:text-surface-600 focus:border-primary focus:outline-none"
              />
              <button className="rounded-l-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-hover">
                أرسل
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs font-medium text-surface-500 md:flex-row">
        <p>© {new Date().getFullYear()} شغلني. جميع الحقوق محفوظة.</p>
        <div className="flex gap-6">
          <a href="#support" className="hover:text-white">الدعم</a>
          <a href="/auth" className="hover:text-white">الدخول</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
