import React, { useMemo, useState } from "react"
import { ArrowLeft, BadgeCheck, CheckCircle, Clock, MapPin, Shield, Sparkles, TrendingUp, Upload, X, Zap } from "lucide-react"
import { createWorkerProfile, getMyWorkerProfile, uploadIdentityDocument, uploadWorkerImage } from "../api"

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف"]
const SPEC_ICON = { "سباك": "🔧", "كهربائي": "⚡", "دهان": "🎨", "تنظيف": "🧹" }

function previewUrl(file) {
  return file ? URL.createObjectURL(file) : ""
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      resolve({ image, url, width: image.width, height: image.height })
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("تعذر قراءة الصورة المختارة."))
    }

    image.src = url
  })
}

async function combineIdentityFiles(frontFile, backFile) {
  if (!frontFile && !backFile) return null
  if (frontFile && !backFile) return frontFile
  if (!frontFile && backFile) return backFile

  const front = await readImageDimensions(frontFile)
  const back = await readImageDimensions(backFile)

  const padding = 32
  const labelHeight = 48
  const canvas = document.createElement("canvas")
  const width = Math.max(front.width, back.width) + padding * 2
  const height = front.height + back.height + padding * 3 + labelHeight * 2

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, width, height)
  context.fillStyle = "#111827"
  context.font = "bold 24px Arial"
  context.direction = "rtl"
  context.textAlign = "right"

  const labelX = width - padding
  let currentY = padding

  context.fillText("البطاقة - الوجه الأمامي", labelX, currentY + 28)
  currentY += labelHeight
  context.drawImage(front.image, (width - front.width) / 2, currentY)
  currentY += front.height + padding

  context.fillText("البطاقة - الوجه الخلفي", labelX, currentY + 28)
  currentY += labelHeight
  context.drawImage(back.image, (width - back.width) / 2, currentY)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92))

  URL.revokeObjectURL(front.url)
  URL.revokeObjectURL(back.url)

  if (!blob) {
    throw new Error("تعذر تجهيز صور البطاقة للرفع.")
  }

  return new File([blob], "identity-front-back.jpg", { type: "image/jpeg" })
}

function FilePreview({ file, label, onClear }) {
  const src = useMemo(() => previewUrl(file), [file])

  if (!file) return null

  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-black text-surface-700">{label}</span>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs font-bold text-surface-500 hover:bg-surface-100"
        >
          <X size={12} />
          إزالة
        </button>
      </div>
      <img src={src} alt={label} className="h-40 w-full rounded-xl object-cover" />
      <p className="mt-2 truncate text-xs font-bold text-surface-500">{file.name}</p>
    </div>
  )
}

export default function BecomeWorker({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    job: "",
    salary: "",
    phoneNumber: "",
    address: "",
    nationalIdNumber: ""
  })
  const [workerImageFile, setWorkerImageFile] = useState(null)
  const [identityFrontFile, setIdentityFrontFile] = useState(null)
  const [identityBackFile, setIdentityBackFile] = useState(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const setField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!workerImageFile) {
        throw new Error("يجب إضافة الصورة الشخصية قبل إرسال طلب التوثيق.")
      }

      if (!identityFrontFile || !identityBackFile) {
        throw new Error("يجب إضافة صورة البطاقة من الأمام والخلف قبل إرسال الطلب.")
      }

      const response = await createWorkerProfile({
        ...form,
        salary: Number(form.salary)
      })

      if (response?.token) {
        localStorage.setItem("token", response.token)
      }

      const workerProfile = await getMyWorkerProfile()
      const workerId = workerProfile?.id || response?.id || response?.workerId || response?.worker?.id

      if (!workerId) {
        throw new Error("تم إنشاء الحساب لكن لم أستطع معرفة معرف العامل لرفع الملفات.")
      }

      if (workerImageFile) {
        await uploadWorkerImage(workerId, workerImageFile)
      }

      const identityFile = await combineIdentityFiles(identityFrontFile, identityBackFile)
      if (identityFile) {
        await uploadIdentityDocument(workerId, identityFile)
      }

      setDone(true)
      onSuccess?.(response)
    } catch (err) {
      setError(err.message || "تعذر إرسال طلب الانضمام حالياً.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center p-6">
        <div className="saas-card relative z-10 w-full max-w-lg border-surface-200 bg-white p-12 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-surface-900">تم استلام طلبك بنجاح</h2>
          <p className="mb-10 font-medium leading-relaxed text-surface-500">
            أُرسل ملفك المهني إلى الخلفية بنجاح، مع الصورة الشخصية وصور البطاقة التي اخترتها من جهازك، وسيبقى الحساب في انتظار مراجعة الإدارة قبل نشره للعميل.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-saas btn-primary h-14 w-full text-base shadow-lg shadow-primary/20"
          >
            العودة إلى المنصة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="relative mb-20 overflow-hidden rounded-[3rem] bg-surface-900 p-10 text-white shadow-2xl shadow-surface-900/10 lg:p-20">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/20 to-transparent" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-soft backdrop-blur-md">
              <Sparkles size={14} />
              Worker Onboarding
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight lg:text-7xl">
              ابدأ مسيرتك
              <br />
              كعامل <span className="italic text-primary">موثوق</span>
            </h1>
            <p className="max-w-xl text-xl font-medium leading-relaxed text-surface-300">
              هذا النموذج متصل مباشرة بالـ backend عندك، لذلك أي طلب يرسل من هنا يدخل نفس دورة التحقق والإدارة المعتمدة في المنصة.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { label: "دخل مباشر", sub: "بدون وسيط" },
                { label: "مرونة كاملة", sub: "حدد وقتك" },
                { label: "نمو مهني", sub: "ابنِ سمعتك" }
              ].map(({ label, sub }) => (
                <div key={label} className="flex flex-col gap-1 border-r border-white/10 pr-6">
                  <div className="text-lg font-black text-white">{label}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden justify-center lg:flex">
            <div className="saas-card rotate-3 scale-105 rounded-[2.5rem] border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:rotate-0">
              <BadgeCheck size={80} className="mb-6 text-primary drop-shadow-sm" />
              <h3 className="mb-2 text-3xl font-black text-white">شغلني PRO</h3>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-surface-400">هوية مهنية معتمدة</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-16 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-12 xl:col-span-5">
          <div className="space-y-4">
            <h3 className="text-3xl font-black leading-tight tracking-tight text-surface-900 md:text-4xl">
              لماذا منصة <span className="text-primary">شغلني</span>؟
            </h3>
            <p className="max-w-md text-lg font-medium text-surface-500">
              الواجهة ترسل البيانات المطلوبة من الخلفية كما هي: التخصص، الهوية الوطنية، الهاتف، العنوان، والأجر.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            {[
              { icon: Zap, title: "إشعارات فورية", text: "تصلك الطلبات والتحديثات فور اعتماد الملف المهني." },
              { icon: Shield, title: "توثيق وأمان", text: "كل ملف يمر على مراجعة الإدارة قبل الظهور للعملاء." },
              { icon: Clock, title: "مرونة في التوفر", text: "بعد قبولك يمكنك إدارة أعمالك وحجوزاتك من نفس المنصة." },
              { icon: TrendingUp, title: "نمو تدريجي", text: "تقييمات العملاء وإحصاءات الأداء تساعدك على بناء سمعتك." }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="group flex items-start gap-5 p-2">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[1rem] bg-surface-50 text-surface-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-bold text-surface-900">{title}</h4>
                  <p className="text-sm font-medium leading-relaxed text-surface-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-7">
          <div className="saas-card border-surface-200 bg-white p-8 shadow-xl shadow-surface-900/[0.03] md:p-12">
            <div className="mb-10">
              <h3 className="mb-2 text-2xl font-black text-surface-900">نموذج التسجيل المهني</h3>
              <p className="text-sm font-medium text-surface-500">
                ارفع الصورة الشخصية وصور الهوية مباشرة من جهازك، وسيشاهدها المدير بوضوح عند مراجعة طلب التوثيق.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">الاسم الكامل</label>
                  <input name="name" required value={form.name} onChange={setField} placeholder="مثال: محمد سالم" className="saas-input h-12 border-surface-100 pr-4 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">التخصص الرئيسي</label>
                  <select name="job" required value={form.job} onChange={setField} className="saas-input h-12 cursor-pointer border-surface-100 pr-4 focus:bg-white">
                    <option value="">اختر تخصصك...</option>
                    {SPECIALTIES.map((specialty) => (
                      <option key={specialty} value={specialty}>{SPEC_ICON[specialty]} {specialty}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">أجر الساعة (MRU)</label>
                  <input name="salary" type="number" min="1" required value={form.salary} onChange={setField} placeholder="التكلفة التقديرية" className="saas-input h-12 border-surface-100 pr-4 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">رقم الهاتف</label>
                  <input name="phoneNumber" type="tel" required value={form.phoneNumber} onChange={setField} placeholder="+222 23243247" dir="ltr" className="saas-input h-12 border-surface-100 pr-4 text-left focus:bg-white" />
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">العنوان أو الحي</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                    <input name="address" required value={form.address} onChange={setField} placeholder="تفرغ زينة، تيارت، لكصر..." className="saas-input h-12 border-surface-100 pr-11 focus:bg-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-surface-400">رقم الهوية الوطنية</label>
                  <input name="nationalIdNumber" required value={form.nationalIdNumber} onChange={setField} placeholder="أدخل رقم الهوية" className="saas-input h-12 border-surface-100 pr-4 focus:bg-white" />
                </div>
              </div>

              <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-black text-surface-900">
                  <Upload size={16} />
                  الصورة الشخصية من جهازك
                </div>
                <label className="mb-4 inline-flex cursor-pointer items-center rounded-xl bg-primary px-4 py-2 text-sm font-black text-white transition-all hover:bg-primary-hover">
                  اختر الصورة الشخصية
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setWorkerImageFile(event.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <p className="mb-4 truncate text-xs font-bold text-surface-500">
                  {workerImageFile ? workerImageFile.name : "لم يتم اختيار صورة بعد."}
                </p>
                <FilePreview file={workerImageFile} label="الصورة الشخصية" onClear={() => setWorkerImageFile(null)} />
                <p className="mt-3 text-xs font-bold text-surface-500">هذه الصورة ستظهر للمدير أثناء المراجعة، ثم للعملاء بعد قبول التوثيق.</p>
              </div>

              <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-surface-900">
                  <Shield size={16} />
                  صور البطاقة من جهازك
                </div>
                <p className="mb-4 text-xs font-bold text-surface-500">اختر صورة الوجه الأمامي وصورة الوجه الخلفي. الواجهة ستدمجهما تلقائيًا وترفعهما كوثيقة هوية واحدة لأن الخلفية الحالية تستقبل ملفًا واحدًا فقط.</p>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black text-surface-500">البطاقة - الوجه الأمامي</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setIdentityFrontFile(event.target.files?.[0] || null)}
                      className="mb-4 block w-full text-sm"
                    />
                    <FilePreview file={identityFrontFile} label="الوجه الأمامي" onClear={() => setIdentityFrontFile(null)} />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black text-surface-500">البطاقة - الوجه الخلفي</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setIdentityBackFile(event.target.files?.[0] || null)}
                      className="mb-4 block w-full text-sm"
                    />
                    <FilePreview file={identityBackFile} label="الوجه الخلفي" onClear={() => setIdentityBackFile(null)} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-saas btn-primary h-14 w-full text-sm font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <Clock className="animate-spin" size={20} />
                      جاري معالجة بياناتك...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      إرسال الملف المهني
                      <ArrowLeft size={20} className="translate-x-1" />
                    </span>
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
