import React, { useState } from "react"
import { Headphones, Send, MessageSquare, Phone, Mail, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function TechnicalSupport() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="page-shell max-w-5xl mx-auto" dir="rtl">
      <header className="mb-12 text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4">
          <Headphones size={14} /> الدعم الفني
        </div>
        <h1 className="text-3xl font-black text-slate-900">نحن هنا لمساعدتك</h1>
        <p className="mt-2 text-slate-500 font-bold italic">أرسل استفسارك وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-4 space-y-4">
          {[
            { icon: Phone, title: "اتصال هاتفي", value: "+222 22 22 22 22", bg: "bg-blue-50", color: "text-blue-600" },
            { icon: Mail, title: "البريد الإلكتروني", value: "support@aamilak.mr", bg: "bg-emerald-50", color: "text-emerald-600" },
            { icon: MessageSquare, title: "المحادثة المباشرة", value: "متاح 24/7", bg: "bg-amber-50", color: "text-amber-600" }
          ].map((item, i) => (
            <div key={i} className="card p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Form */}
        <div className="lg:col-span-8">
          <div className="card-lg h-full">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="field">
                      <label className="auth-label">الاسم بالكامل</label>
                      <input type="text" className="input" placeholder="مثال: أحمد محمد" required />
                    </div>
                    <div className="field">
                      <label className="auth-label">البريد الإلكتروني</label>
                      <input type="email" className="input text-left" placeholder="your@email.com" required />
                    </div>
                  </div>
                  
                  <div className="field">
                    <label className="auth-label">عنوان الرسالة</label>
                    <input type="text" className="input" placeholder="ما هو موضوع استفسارك؟" required />
                  </div>

                  <div className="field">
                    <label className="auth-label">تفاصيل المشكلة</label>
                    <textarea 
                      className="input min-h-[150px] py-4" 
                      placeholder="اشرح لنا المشكلة التي تواجهها بالتفصيل..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-full">
                    إرسال الطلب <Send size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">تم استلام رسالتك بنجاح!</h2>
                  <p className="text-slate-500 font-bold max-w-sm">شكراً لتواصلك معنا. سيقوم فريق الدعم الفني بمراجعة طلبك والرد عليك عبر البريد الإلكتروني في غضون 24 ساعة.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-primary font-black text-sm hover:underline"
                  >
                    إرسال رسالة أخرى
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
