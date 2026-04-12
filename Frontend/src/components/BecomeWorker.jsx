import React, { useState } from "react"
import { CheckCircle, Zap, Shield, Clock, TrendingUp, BadgeCheck, ArrowLeft, Briefcase, MapPin, Sparkles } from "lucide-react"

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف"]
const SPEC_ICON   = { "سباك": "🔧", "كهربائي": "⚡", "دهان": "🎨", "تنظيف": "🧹" }

export default function BecomeWorker() {
  const [form, setForm]       = useState({ name: "", specialty: "", price: "", phone: "", address: "" })
  const [done, setDone]       = useState(false)
  const [loading, setLoading] = useState(false)

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setDone(true)
  }

  /* ── Success Screen ── */
  if (done) return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div className="saas-card p-12 max-w-lg w-full text-center relative z-10 bg-white border-surface-200">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-100">
           <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-black text-surface-900 mb-4 tracking-tight">تم استلام طلبك بنجاح!</h2>
        <p className="text-surface-500 font-medium leading-relaxed mb-10">
          شكراً لانضمامك إلينا. سنقوم بمراجعة بياناتك وتفعيل حسابك المهني خلال 24 ساعة القادمة. ستتلقى إشعاراً فور الموافقة.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-saas btn-primary w-full h-14 text-base shadow-lg shadow-primary/20"
        >
          العودة للوحة التحكم
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 lg:px-10">
      
      {/* SaaS Style Hero Section */}
      <div className="relative overflow-hidden bg-surface-900 text-white p-10 lg:p-20 mb-20 rounded-[3rem] shadow-2xl shadow-surface-900/10">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-[0.2em] text-primary-soft border border-white/10 uppercase">
              <Sparkles size={14} />
              Professional Growth System
            </div>
            <h1 className="text-4xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              ابدأ مسيرتك <br />
              كمحترف <span className="text-primary italic">موثوق</span>
            </h1>
            <p className="text-xl text-surface-300 font-medium leading-relaxed max-w-xl">
              انضم إلى المنصة الرائدة في موريتانيا لربط الحرفيين المهرة مع آلاف العملاء الباحثين عن الجودة والالتزام.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { label: "أرباح مباشرة", sub: "بدون وسيط" },
                { label: "حرية كاملة", sub: "حدد وقتك" },
                { label: "دعم مستمر", sub: "نحن معك" },
              ].map(({label, sub}) => (
                <div key={label} className="flex flex-col gap-1 pr-6 border-r border-white/10">
                  <div className="text-lg font-black text-white">{label}</div>
                  <div className="text-[10px] text-primary font-bold uppercase tracking-widest">{sub}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:flex justify-center relative">
             <div className="saas-card p-10 bg-white/5 backdrop-blur-xl border-white/10 rounded-[2.5rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 scale-105">
                <BadgeCheck size={80} className="text-primary mb-6 filter drop-shadow-sm" />
                <h3 className="font-black text-3xl mb-2 text-white">شغلني PRO</h3>
                <p className="text-xs text-surface-400 font-bold uppercase tracking-[0.2em]">هوية مهنية معتمدة</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16 items-start">
        
        {/* Left: Benefits & Features */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-12">
          <div className="space-y-4">
             <h3 className="text-3xl md:text-4xl font-black text-surface-900 tracking-tight leading-tight">لماذا منصة <span className="text-primary">شغلني</span>؟</h3>
             <p className="text-lg font-medium text-surface-500 max-w-md">نحن نوفر لك الأدوات اللازمة للنجاح وتحقيق دخل إضافي مستقر ومستمر.</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-6">
            {[
              { icon: Zap, h: "إشعارات ذكية وفورية", p: "ستصلك عروض المهام المتوافقة مع تخصصك في منطقتك الجغرافية لحظة نشرها." },
              { icon: Shield, h: "أمان وموثوقية عالية", p: "نضمن لك حقوقك المالية وتعاملات آمنة مع كافة العملاء عبر نظام التقييم." },
              { icon: Clock, h: "مرونة كاملة في العمل", p: "أنت مدير نفسك. شغّل حالة التفرغ عندما تكون مستعداً للعمل وأوقفها متى شئت." },
              { icon: TrendingUp, h: "توسع وانتشار لقاعدة عملائك", p: "ابنِ سمعتهك المهنية عبر التقييمات الإيجابية واجذب المزيد من العملاء الدائمين." },
            ].map(({ icon: Icon, h, p }, i) => (
              <div key={i} className="flex items-start gap-5 p-2 group">
                <div className="w-12 h-12 rounded-[1rem] bg-surface-50 text-surface-400 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 text-lg mb-2">{h}</h4>
                  <p className="text-sm font-medium text-surface-500 leading-relaxed">{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="saas-card p-8 md:p-12 bg-white border-surface-200 shadow-xl shadow-surface-900/[0.03]">
            <div className="mb-10">
              <h3 className="text-2xl font-black text-surface-900 mb-2">نموذج التسجيل السريع</h3>
              <p className="text-sm font-medium text-surface-500">يرجى إدخال بياناتك بدقة ليتمكن العملاء من التواصل معك.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">الاسم الكامل</label>
                  <input
                    name="name" required value={form.name} onChange={set}
                    placeholder="مثال: محمد سالم"
                    className="saas-input h-12 pr-4 border-surface-100 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">التخصص الرئيسي</label>
                  <select
                    name="specialty" required value={form.specialty} onChange={set}
                    className="saas-input h-12 pr-4 border-surface-100 focus:bg-white cursor-pointer"
                  >
                    <option value="">اختر تخصصك…</option>
                    {SPECIALTIES.map(s => (
                       <option key={s} value={s}>{SPEC_ICON[s]} {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">أجر الساعة (MRU)</label>
                  <input
                    name="price" type="number" required value={form.price} onChange={set}
                    placeholder="التكلفة التقديرية"
                    className="saas-input h-12 pr-4 border-surface-100 focus:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">رقم الهاتف</label>
                  <input
                    name="phone" type="tel" required value={form.phone} onChange={set}
                    placeholder="X XX XX XX" dir="ltr"
                    className="saas-input h-12 pr-4 text-left border-surface-100 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black text-surface-400 uppercase tracking-widest block">العنوان أو الحي</label>
                 <div className="relative">
                   <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 pointer-events-none" size={18} />
                   <input
                     name="address" required value={form.address} onChange={set}
                     placeholder="تفرغ زينة، تيارت، لكصر..."
                     className="saas-input h-12 pr-11 border-surface-100 focus:bg-white"
                   />
                 </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-saas btn-primary w-full h-14 text-sm font-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                       <Clock className="animate-spin" size={20} />
                       جاري معالجة بياناتك...
                    </span>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>إرسال الملف وتفعيل الحساب</span>
                      <ArrowLeft size={20} className="translate-x-1" />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}