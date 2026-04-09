import React, { useState } from "react"
import { CheckCircle, Zap, Shield, Clock, TrendingUp, BadgeCheck, ArrowLeft, Briefcase, MapPin } from "lucide-react"

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف"]
const SPEC_ICON   = { "سباك": "🔧", "كهربائي": "⚡", "دهان": "🎨", "تنظيف": "✦" }

export default function BecomeWorker() {
  const [form, setForm]       = useState({ name: "", specialty: "", price: "", phone: "", address: "" })
  const [done, setDone]       = useState(false)
  const [loading, setLoading] = useState(false)

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    // TODO: await api.createWorkerProfile(form)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setDone(true)
  }

  /* ── شاشة النجاح (2026 Edition) ── */
  if (done) return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="glass-squircle p-12 max-w-lg w-full text-center relative z-10 z-[1] bg-white/90">
        <div className="w-24 h-24 bg-[#00F0FF]/10 text-[#00F0FF] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative overflow-hidden">
           <div className="absolute inset-0 bg-[#00F0FF]/5 rounded-full animate-ping" />
           <CheckCircle size={48} className="relative z-10 text-[#00B0FF]" />
        </div>
        <h2 className="text-3xl font-black text-[#1E293B] mb-4">تم تسجيل البيانات!</h2>
        <p className="text-[#64748B] font-semibold leading-relaxed mb-10 text-sm">
          أنت الآن بصدد الانضمام للجيل القادم من المحترفين. سنقوم بمعالجة ردارك الشخصي والتواصل معك عبر المنصة فوراً.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-2026 w-full text-lg shadow-lg"
        >
          العودة لوحدة التحكم
        </button>
      </div>
    </div>
  )

  /* ── النموذج ── */
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
      
      {/* بانر علوي (Hero 2026) */}
      <div className="relative overflow-hidden bg-[#070B19] text-white p-10 lg:p-16 mb-12 shadow-[0_30px_60px_-15px_rgba(112,0,255,0.3)] rounded-[3rem]">
        
        {/* Futuristic FX */}
        <div className="absolute top-0 start-0 w-[800px] h-[800px] bg-[#7000FF]/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 end-0 w-[600px] h-[600px] bg-[#00F0FF]/25 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50" />
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black tracking-widest mb-6 border border-[#00F0FF]/30 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              ✦ نظام الارتقاء المهني
            </span>
            <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] mb-6 drop-shadow-md tracking-tight">
              حوّل مهاراتك الفردية إلى <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#7000FF]">عائد مالي مستدام</span>
            </h1>
            <p className="text-lg text-white/70 font-semibold leading-relaxed mb-10 max-w-lg">
              شبكة المستقبل تبحث عنك. تواصل مع مئات العملاء الجاهزين باستخدام خوارزميات التوصيل الجغرافي الفورية.
            </p>
            
            <div className="flex flex-wrap gap-8">
              {[
                { em: "⚡", t: "أرباح مضاعفة 3×", s: "معدلات استثنائية دون وسطاء" },
                { em: "🌐", t: "توصيل جغرافي دقيق", s: "خوارزميات تحدد الأقرب إليك" },
                { em: "🔐", t: "عقود ذكية آمنة", s: "مستحقاتك المشفرة آمنة دائماً" },
              ].map(({em, t, s}) => (
                <div key={t} className="flex items-center gap-4 bg-white/5 p-3 pr-4 rounded-2xl border border-white/5 backdrop-blur-md transition-all hover:bg-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7000FF] to-[#00F0FF] flex items-center justify-center text-lg shadow-inner">{em}</div>
                  <div>
                    <div className="text-sm font-black">{t}</div>
                    <div className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end relative">
             <div className="absolute w-[300px] h-[300px] bg-[#00F0FF]/20 rounded-full blur-3xl pointer-events-none" />
             <div className="w-72 h-72 bg-white/10 backdrop-blur-2xl border-t border-s border-white/20 rounded-[3rem] shadow-[20px_20px_60px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center p-8 text-center transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105 z-10 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-[3rem] opacity-50" />
               <BadgeCheck size={80} className="text-[#00F0FF] mb-6 drop-shadow-[0_0_15px_#00F0FF]" />
               <h3 className="font-black text-2xl mb-2 text-white shadow-black">شارة المحترف</h3>
               <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">هوية موثقة 100%</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* المزايا */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-8">
             <h3 className="text-3xl font-black text-[#1E293B] mb-2 tracking-tight">قوة التكنولوجيا بين يديك</h3>
             <p className="text-[#64748B] font-bold">لماذا تعتبر منصتنا الوجهة الأولى للمحترفين؟</p>
          </div>
          <div className="space-y-5">
            {[
              { icon: Zap, h: "تنبيهات مهام فورية", p: "يرن هاتفك الذكي فور توفر مهمة متوافقة مع تخصصك." },
              { icon: Shield, h: "دفعات رقمية سريعة", p: "محفظتك تزيد بانتظام بعد كل إغلاق ناجح لأي أمر عمل." },
              { icon: Clock, h: "حرية التوقيت الكاملة", p: "شغّل حالة التوفر عند وجودك، وأوقفها وقت راحتك الشخصية." },
              { icon: TrendingUp, h: "لوحة تحكم ذكية", p: "تتبع معدلات أدائك وإحصاءات الأرباح بشفافية مطلقة." },
            ].map(({ icon: Icon, h, p }, i) => (
              <div key={i} className="glass-squircle p-6 flex items-start gap-5 hover:bg-white/80">
                <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-[#7000FF]/10 to-[#00F0FF]/10 text-[#7000FF] flex flex-col items-center justify-center flex-shrink-0 shadow-inner">
                  <Icon size={24} />
                </div>
                <div className="mt-1">
                  <h4 className="font-black text-[#1E293B] text-base mb-1">{h}</h4>
                  <p className="text-xs font-semibold text-[#64748B] leading-relaxed">{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* النموذج */}
        <div className="lg:col-span-7">
          <div className="glass-squircle p-8 sm:p-12 relative overflow-hidden bg-white/90">
            {/* Soft backdrop decorations inside card */}
            <div className="absolute top-0 end-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 start-0 w-64 h-64 bg-[#7000FF]/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="mb-10 relative z-10">
              <h3 className="text-3xl font-black text-[#1E293B] mb-2">تسجيل القيد السريع</h3>
              <p className="text-sm font-bold text-[#64748B]">لا يستغرق الانضمام سوى ثوانٍ معدودة. أدخل التفاصيل واضغط انطلاق.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black tracking-wider text-[#64748B] uppercase mb-2">اسمك بالكامل (كالمصرح به)</label>
                  <input
                    name="name" required value={form.name} onChange={set}
                    placeholder="مثال: أحمد سالم"
                    className="w-full bg-[#F4F7FD] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#7000FF] focus:ring-4 focus:ring-[#7000FF]/10 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black tracking-wider text-[#64748B] uppercase mb-2">المسار المهني الرئيسي</label>
                  <select
                    name="specialty" required value={form.specialty} onChange={set}
                    className="w-full bg-[#F4F7FD] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#7000FF] focus:ring-4 focus:ring-[#7000FF]/10 transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="">حدد نطاق العمل…</option>
                    {SPECIALTIES.map(s => (
                       <option key={s} value={s}>{SPEC_ICON[s]} {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-black tracking-wider text-[#64748B] uppercase mb-2">أجر العمل المطلوب (MRU/H)</label>
                  <input
                    name="price" type="number" required value={form.price} onChange={set}
                    placeholder="التسعيرة التقديرية"
                    className="w-full bg-[#F4F7FD] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-[#7000FF] focus:ring-4 focus:ring-[#7000FF]/10 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black tracking-wider text-[#64748B] uppercase mb-2">رقم هاتف الطوارئ والتواصل</label>
                  <input
                    name="phone" type="tel" required value={form.phone} onChange={set}
                    placeholder="X XX XX XX" dir="ltr"
                    className="w-full bg-[#F4F7FD] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-end focus:outline-none focus:border-[#7000FF] focus:ring-4 focus:ring-[#7000FF]/10 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                 <label className="block text-[11px] font-black tracking-wider text-[#64748B] uppercase mb-2">الموقع الجغرافي للنشاط</label>
                 <div className="relative">
                   <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input
                     name="address" required value={form.address} onChange={set}
                     placeholder="حدد نطاق السكن أو العمل"
                     className="w-full bg-[#F4F7FD] border border-slate-200 rounded-2xl px-5 pe-12 py-4 text-sm font-bold focus:outline-none focus:border-[#7000FF] focus:ring-4 focus:ring-[#7000FF]/10 transition-all shadow-inner"
                   />
                 </div>
              </div>

              <button type="submit" disabled={loading} className="btn-2026 w-full mt-6 py-5 group shadow-xl">
                {loading ? (
                   <span className="animate-pulse">يتم إدخال البيانات في الخوادم...</span>
                ) : (
                   <div className="flex items-center gap-2">
                     <span>إرسال الملف وتفعيل החساب</span>
                     <ArrowLeft size={18} className="transform group-hover:-translate-x-1.5 transition-transform" />
                   </div>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}