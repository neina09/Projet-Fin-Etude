import { Phone, CheckCircle, Clock, Users, MapPin, CreditCard } from "lucide-react"

const stats = [
  { val: "+8K", label: "محترف موثّق" },
  { val: "+40K", label: "مهمة منجزة" },
  { val: "4.8/5", label: "متوسط التقييم" },
]

const features = [
  { icon: Phone, title: "طلب سريع ومريح", text: "بضع نقرات فقط تفصلك عن حجز الفني المناسب لمنزلك أو مكتبك." },
  { icon: CheckCircle, title: "جودة واحترافية", text: "كل عامل في منصتنا يخضع لعملية تدقيق شاملة لضمان التميز." },
  { icon: Clock, title: "شفافية في الأسعار", text: "لا توجد تكاليف مخفية. ستعرف التكلفة التقديرية قبل تأكيد الحجز." },
  { icon: Users, title: "دعم متبادل", text: "نهتم بتبسيط حياة العملاء مع توفير فرص دخل مجزية لشركائنا العمال." },
  { icon: MapPin, title: "تغطية جغرافية واسعة", text: "نربطك تلقائياً بأقرب محترف متاح في منطقتك الجغرافية الحالية." },
  { icon: CreditCard, title: "خيارات دفع مرنة", text: "ادفع نقداً أو إلكترونياً. أمنك المالي أولويتنا وراحتك هي هدفنا." },
]

export default function AboutUs() {
  return (
    <section id="about" dir="rtl" className="py-24 bg-white">
      <div className="section-shell">
        <div className="saas-card p-8 md:p-12 lg:p-16 border-surface-200">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Main Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4 text-right">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Mission & Vision</p>
                <h2 className="text-3xl md:text-5xl font-black text-surface-900 leading-tight">
                  نحن نعيد تعريف <br />
                  <span className="text-primary italic">الخدمات المنزلية</span> في موريتانيا
                </h2>
                <p className="text-surface-500 text-lg font-medium leading-relaxed max-w-xl">
                  منصة شغلني هي حلقة الوصل الرقمية الأكثر أماناً وموثوقية، حيث نجمع نخبة الحرفيين والعمال مع أصحاب المنازل والشركات في بيئة عمل احترافية وسلسة.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-surface-100">
                {stats.map(({ val, label }) => (
                  <div key={label} className="space-y-1 text-right">
                    <p className="text-2xl md:text-4xl font-black text-surface-900">{val}</p>
                    <p className="text-[10px] md:text-xs font-bold text-surface-400 uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-4 group">
                  <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-surface-900 mb-2">{feature.title}</h3>
                    <p className="text-sm font-medium text-surface-400 leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}