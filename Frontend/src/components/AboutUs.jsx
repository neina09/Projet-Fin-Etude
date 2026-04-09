import { Phone, CheckCircle, Clock, Users, MapPin, CreditCard } from "lucide-react"

const stats = [
  { val: "+8K", label: "عامل موثّق" },
  { val: "+40K", label: "طلب منجز" },
  { val: "4.8", label: "متوسط التقييم" },
]

const features = [
  { icon: Phone, color: "blue", title: "طلب سريع في دقيقتين", text: "اختر الخدمة وحدد موعدك المناسب، والعامل يصلك مباشرة." },
  { icon: CheckCircle, color: "blue", title: "عمال موثّقون ومقيّمون", text: "كل عامل مسجّل بهوية وله سجل تقييمات حقيقي من العملاء." },
  { icon: Clock, color: "yellow", title: "تسعيرة واضحة مسبقاً", text: "لا مفاجآت في الفاتورة — تعرف السعر قبل تأكيد الطلب." },
  { icon: Users, color: "blue", title: "دعم العمال والعملاء", text: "المنصة تخدم الطرفين: فرص عمل دائمة وخدمة موثوقة." },
  { icon: MapPin, color: "blue", title: "خدمة في منطقتك", text: "ربط تلقائي بأقرب عامل متاح بحسب موقعك الجغرافي." },
  { icon: CreditCard, color: "yellow", title: "دفع آمن ومرن", text: "نقداً أو إلكترونياً — الدفع يتم فقط بعد إتمام الخدمة." },
]

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  yellow: "bg-yellow-50 text-yellow-600",
}

export default function AboutUs() {
  return (
    <section id="about" dir="rtl" className="py-16 bg-white">
      <div className="section-shell">
        <div className="border border-slate-200 rounded-2xl p-6 md:p-8">

          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">من نحن</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-3">
            نربطك بأفضل <span className="text-blue-600">عمال الخدمات المنزلية</span> بضغطة واحدة
          </h2>
          <p className="text-slate-500 text-sm leading-loose mb-6">
            منصة رقمية تجمع الكهربائيين، السباكين، عمال النظافة، وسائر الحرفيين المهرة في مكان واحد.
            اطلب الخدمة، راجع التقييمات، وأكّد موعدك في دقائق — بدون وسيط.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map(({ val, label }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-blue-600">{val}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((feature) => {
              const FeatureIcon = feature.icon
              return (
                <div key={feature.title} className="border border-slate-200 rounded-xl p-4 flex gap-3 items-start hover:border-blue-300 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorMap[feature.color]}`}>
                    <FeatureIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 mb-1">{feature.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}