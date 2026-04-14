import React from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "واجهة أوضح",
    role: "تجربة استخدام",
    text: "النسخة الجاهزة للنشر يجب أن تشرح للمستخدم أين ينشر المهمة وأين يتابع العرض وأين يفتح المحادثة بدون ارتباك.",
    rating: 5,
    initials: "و"
  },
  {
    name: "تنقل ثابت",
    role: "لوحة التحكم",
    text: "ربط أقسام الحساب بعنوان الصفحة مهم حتى لا يشعر المستخدم أنه خرج من المسار عندما ينتقل بين الرسائل والمهام.",
    rating: 5,
    initials: "ت"
  },
  {
    name: "ثقة أعلى",
    role: "الانطباع الأول",
    text: "استبدال الصور والروابط الوهمية بمكونات واقعية يرفع الثقة مباشرة ويجعل المنصة تبدو أقرب إلى منتج حقيقي.",
    rating: 5,
    initials: "ث"
  }
]

function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-24" dir="rtl">
      <div className="section-shell">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">مؤشرات الجودة</p>
          <h2 className="text-3xl font-black tracking-tight text-surface-900 md:text-4xl">ما الذي يجعل المنصة تبدو جاهزة فعلاً؟</h2>
          <p className="mt-4 font-medium leading-relaxed text-surface-500">
            الأمثلة هنا لم تعد شهادات وهمية، بل رسائل قصيرة تلخص ما ينبغي أن يشعر به المستخدم داخل النسخة النهائية.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article key={index} className="saas-card group relative flex flex-col justify-between p-8 transition-all duration-300 hover:border-primary/20">
              <div className="absolute left-6 top-6 text-primary/10 transition-colors group-hover:text-primary/20">
                <Quote size={40} className="rotate-180" />
              </div>

              <div className="relative z-10">
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} size={16} className="fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="mb-8 text-base font-medium italic leading-relaxed text-surface-700">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-surface-100 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-soft bg-surface-50 text-sm font-black text-surface-900">
                  {testimonial.initials}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-black text-surface-900">{testimonial.name}</p>
                  <p className="text-xs font-bold text-surface-400">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
