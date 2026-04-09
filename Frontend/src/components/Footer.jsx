import React from "react"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer dir="rtl" className="mt-16 bg-slate-950 text-slate-300 pt-16 pb-8 px-6">
      <div className="section-shell grid md:grid-cols-4 gap-10">

        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-black text-white mb-3">
            شغلني
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            نربط الناس بعمال محليين مهرة — بسرعة وسهولة وموثوقية.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            <Facebook className="hover:text-blue-400 cursor-pointer transition-colors duration-200" />
            <Twitter className="hover:text-blue-400 cursor-pointer transition-colors duration-200" />
            <Instagram className="hover:text-blue-400 cursor-pointer transition-colors duration-200" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-black mb-4">الشركة</h3>
          <ul className="space-y-2 text-sm font-semibold">
            <li className="hover:text-blue-300 cursor-pointer transition-colors duration-200">من نحن</li>
            <li className="hover:text-blue-300 cursor-pointer transition-colors duration-200">شركاؤنا</li>
            <li className="hover:text-blue-300 cursor-pointer transition-colors duration-200">الوظائف</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-black mb-4">النظام</h3>
          <ul className="space-y-2 text-sm font-semibold">
            <li className="hover:text-blue-300 cursor-pointer transition-colors duration-200">إدارة الحجوزات</li>
            <li className="hover:text-blue-300 cursor-pointer transition-colors duration-200">سوق المهام</li>
            <li className="hover:text-blue-300 cursor-pointer transition-colors duration-200">الرسائل والإشعارات</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-black mb-4">تواصل معنا</h3>
          <div className="space-y-2 text-sm font-semibold">
            <p className="flex items-center gap-2"><Mail size={16} /><span>support@chghloni.com</span></p>
            <p className="flex items-center gap-2"><Phone size={16} /><span>+222 44 44 44 44</span></p>
            <p className="flex items-center gap-2"><MapPin size={16} /><span>نواكشوط، موريتانيا</span></p>
          </div>

          {/* Newsletter */}
          <div className="mt-4">
            <p className="text-sm mb-2 font-semibold">اشترك في النشرة البريدية</p>
            <div className="flex flex-row-reverse">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full px-3 py-2 rounded-r-lg bg-white/10 text-white text-sm outline-none placeholder:text-slate-500"
              />
              <button
                className="bg-blue-600 text-white px-4 rounded-l-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                اشترك
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="section-shell border-t border-white/10 mt-10 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} شغلني. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}

export default Footer