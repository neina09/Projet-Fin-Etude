import React from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "أحمد ولد سالم",
    role: "صاحب منزل",
    text: "وجدت سباكاً في أقل من 10 دقائق! الخدمة كانت رائعة ومحترفة جداً، والأسعار كانت واضحة منذ البداية. أنصح الجميع بتجربة شغلني.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "فاطمة منت الشيخ",
    role: "صاحبة عمل",
    text: "العمال في المنصة موثوقون جداً. أستخدم شغلني بشكل أسبوعي لمتجري والنتائج دائماً مبهرة. ميزة الدفع السلس والتقييم رائعة.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "محمد لمين",
    role: "عامل مستقل",
    text: "منذ انضمامي كعامل لم تكن المهام تنقطع. المنصة وفرت لي فرصاً لم أكن لأجدها بطرق التواصل التقليدية. سهولة الاستخدام تجعل التجربة مريحة.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/55.jpg",
  },
]

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white" dir="rtl">
      <div className="section-shell">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Customer Success</p>
          <h2 className="text-3xl md:text-4xl font-black text-surface-900 tracking-tight">ماذا يقول عملاؤنا عنا؟</h2>
          <p className="mt-4 text-surface-500 font-medium leading-relaxed">
            آراء حقيقية من مئات المستخدمين والعمال الذين غيرت منصة شغلني طريقة إنجازهم للمهام اليومية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <article key={i} className="saas-card p-8 relative flex flex-col justify-between group hover:border-primary/20 transition-all duration-300">
              <div className="absolute top-6 left-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                 <Quote size={40} className="rotate-180" />
              </div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-base font-medium text-surface-700 leading-relaxed mb-8 italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-surface-100 pt-6">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary-soft">
                  <img src={t.img} alt={t.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-black text-surface-900">{t.name}</p>
                  <p className="text-xs font-bold text-surface-400">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Rating Summary Badge */}
        <div className="mt-20 text-center animate-fade-in">
           <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-surface-50 border border-surface-200 shadow-sm">
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-surface-900">4.9/5</span>
                <span className="text-[10px] uppercase font-bold text-surface-400 tracking-wider">متوسط التقييم</span>
             </div>
             <div className="h-10 w-px bg-surface-200" />
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-surface-900">2K+</span>
                <span className="text-[10px] uppercase font-bold text-surface-400 tracking-wider">رأي حقيقي</span>
             </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials