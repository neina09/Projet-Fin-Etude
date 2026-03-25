import React from "react"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

function Footer() {
  return (
    <footer dir="rtl" className="bg-[#001f3f] text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "'Cairo', sans-serif" }}>
            شغلني
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
            نربط الناس بعمال محليين مهرة — بسرعة وسهولة وموثوقية.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            <Facebook className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200" />
            <Twitter className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200" />
            <Instagram className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>الشركة</h3>
          <ul className="space-y-2 text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <li className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200">من نحن</li>
            <li className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200">وظائف</li>
            <li className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200">المدونة</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>الخدمات</h3>
          <ul className="space-y-2 text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <li className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200">ابحث عن عمال</li>
            <li className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200">كن عاملاً</li>
            <li className="hover:text-[#FFB909] cursor-pointer transition-colors duration-200">كيف يعمل</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>تواصل معنا</h3>
          <div className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Mail size={16} />
            <span>support@chghloni.com</span>
          </div>

          {/* Newsletter */}
          <div className="mt-4">
            <p className="text-sm mb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>اشترك في نشرتنا البريدية</p>
            <div className="flex flex-row-reverse">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full px-3 py-2 rounded-r-lg bg-white/10 text-white text-sm outline-none placeholder:text-gray-500"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
              <button
                className="bg-[#FFB909] text-[#004384] px-4 rounded-l-lg text-sm font-semibold hover:bg-yellow-400 transition-colors duration-200"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                اشترك
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-500" style={{ fontFamily: "'Cairo', sans-serif" }}>
        © {new Date().getFullYear()} شغلني. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}

export default Footer