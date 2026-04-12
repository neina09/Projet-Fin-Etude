import React from "react"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer dir="rtl" className="bg-surface-900 text-surface-200 pt-20 pb-10 px-6 mt-24">
      <div className="section-shell grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white tracking-tight">شغلني</h2>
          <p className="text-sm leading-relaxed text-surface-400 max-w-xs">
            المنصة الرائدة لربط العملاء بأفضل الحرفيين والعمال المحليين المهرة في موريتانيا — بسرعة، أمان، وموثوقية عالية.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
              <a key={idx} href="#" className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-primary hover:border-primary transition-all duration-300">
                <Icon size={18} className="text-surface-300" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Section 1 */}
        <div>
          <h3 className="text-white font-bold mb-6 text-base">الشركة</h3>
          <ul className="space-y-4 text-sm font-medium">
            {["من نحن", "شركاؤنا", "الوظائف", "المدونة"].map(item => (
              <li key={item}>
                <a href="#" className="text-surface-400 hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Section 2 */}
        <div>
          <h3 className="text-white font-bold mb-6 text-base">النظام</h3>
          <ul className="space-y-4 text-sm font-medium">
            {["إدارة الحجوزات", "سوق المهام", "الرسائل والإشعارات", "سياسة الخصوصية"].map(item => (
              <li key={item}>
                <a href="#" className="text-surface-400 hover:text-white transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <h3 className="text-white font-bold mb-6 text-base">تواصل معنا</h3>
          <div className="space-y-4 text-sm font-medium">
            <p className="flex items-center gap-3 text-surface-400">
              <Mail size={16} className="text-primary" /> 
              <span>support@chghloni.com</span>
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

          {/* Newsletter */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs font-bold text-white mb-3 uppercase tracking-wider">النشرة البريدية</p>
            <div className="flex">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors placeholder:text-surface-600"
              />
              <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-l-lg text-sm font-bold transition-colors">
                اشترك
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="section-shell border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-surface-500">
        <p>© {new Date().getFullYear()} شغلني. كافة الحقوق محفوظة.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">الشروط والأحكام</a>
          <a href="#" className="hover:text-white">كوكيز</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer