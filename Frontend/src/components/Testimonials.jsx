import React from "react"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "مريم بنت سيدي",
    role: "عميلة مستمرة",
    text: "المنصة سهلت علي الكثير من الوقت في البحث عن فنيين موثوقين. الجودة والسرعة في التعامل هي أكثر ما أعجبني.",
    rating: 5,
    image: "https://i.pravatar.cc/100?u=f1"
  },
  {
    name: "سيدي محمد",
    role: "صاحب منزل",
    text: "بفضل منصة العمل، تمكنت من إصلاح كافة أعطال المنزل في يوم واحد. العمال هنا محترفون جداً وملتزمون بالمواعيد.",
    rating: 5,
    image: "https://i.pravatar.cc/100?u=m1"
  }
]

function Testimonials() {
  return (
    <section id="testimonials" className="bg-slate-50 py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Right Side: Text Area (RTL) */}
          <div>
            <h2 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
              ماذا يقول <span className="text-brand-blue">عملاؤنا</span> عن تجربة منصة العمل؟
            </h2>
            <p className="mt-8 text-lg font-medium leading-relaxed text-slate-500">
              ثقة عملائنا هي سر نجاحنا. نحن نفخر بتقديم أفضل الخدمات الميدانية لآلاف المستخدمين يومياً من خلال نخبة من أمهر المحترفين.
            </p>
            
            <div className="mt-10 flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-950">98%</span>
                  <span className="text-sm font-bold text-slate-400">نسبة الرضا</span>
               </div>
               <div className="h-10 w-px bg-slate-200" />
               <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-950">+5k</span>
                  <span className="text-sm font-bold text-slate-400">عميل سعيد</span>
               </div>
            </div>
          </div>

          {/* Left Side: Testimonial Cards */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-x-2">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full border-2 border-blue-50" />
                    <div>
                      <h4 className="font-black text-slate-950">{testimonial.name}</h4>
                      <p className="text-xs font-bold text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Quote size={20} className="absolute -right-2 -top-2 rotate-180 text-blue-50" />
                  <p className="relative z-10 text-base font-medium leading-relaxed text-slate-600 italic">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
