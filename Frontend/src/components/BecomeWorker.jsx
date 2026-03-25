import React, { useState } from "react"
import { CheckCircle, Zap, Shield, Clock, TrendingUp, BadgeCheck } from "lucide-react"

const SPECIALTIES = ["سباك", "كهربائي", "دهان", "تنظيف"]
const SPEC_ICON   = { "سباك": "🔧", "كهربائي": "⚡", "دهان": "🎨", "تنظيف": "✦" }

export default function BecomeWorker() {
  const [form, setForm]       = useState({ name: "", specialty: "", price: "", phone: "" })
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

  /* ── شاشة النجاح ── */
  if (done) return (
    <div dir="rtl" style={S.page}>
      <div style={S.succWrap}>
        <div style={S.succRing}>
          <CheckCircle size={36} color="#1558F6" />
        </div>
        <h2 style={S.succTitle}>تم إرسال طلبك!</h2>
        <p style={S.succSub}>
          سنراجع ملفك الشخصي ونتواصل معك خلال 24 ساعة. مرحباً بك في شبكة شغّلني.
        </p>
      </div>
    </div>
  )

  /* ── النموذج ── */
  return (
    <div dir="rtl" style={S.page}>
      <div style={S.wrapper}>

        {/* بانر علوي */}
        <div style={S.hero}>
          <div style={S.heroText}>
            <h2 style={S.heroTitle}>ابدأ الكسب مع شغّلني</h2>
            <p style={S.heroSub}>
              انضم إلى مئات المحترفين الموثوقين. تواصل مع عملاء يبحثون عن مهاراتك —
              وفق جدولك الخاص.
            </p>
          </div>

          <div style={S.heroItems}>
            {[
              ["💰", "دخل أعلى بـ 3×",         "مقارنةً بالتوظيف التقليدي"],
              ["📍", "عملاء قريبون منك",         "وظائف بالقرب من منطقتك"],
              ["🔒", "دفع آمن ومضمون",           "نتولى المدفوعات بدلاً عنك"],
            ].map(([em, t, s]) => (
              <div style={S.heroItem} key={t}>
                <span style={S.heroEm}>{em}</span>
                <div>
                  <div style={S.heroItemT}>{t}</div>
                  <div style={S.heroItemS}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* عمودان */}
        <div style={S.cols}>

          {/* المزايا */}
          <div style={S.perksCard}>
            <div style={S.perksHead}>لماذا يختارنا المحترفون؟</div>
            <div style={S.perksList}>
              {[
                [<Zap size={16}/>,        "مطابقة فورية للوظائف",   "تواصل مع عملاء يحتاجون تخصصك الآن"],
                [<BadgeCheck size={16}/>, "شارة التحقق",             "الملف الموثوق يبني الثقة ويجلب عملاء أكثر"],
                [<Clock size={16}/>,      "اعمل بشروطك",            "تحكم كامل في وقتك وعدد ساعاتك"],
                [<TrendingUp size={16}/>, "طوّر مسيرتك",            "اجمع تقييمات، اكسب شارات، وارتقِ بملفك"],
              ].map(([ic, h, p], i) => (
                <div style={S.perk} key={i}>
                  <div style={S.perkIcon}>{ic}</div>
                  <div>
                    <h4 style={S.perkH}>{h}</h4>
                    <p style={S.perkP}>{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* النموذج */}
          <div style={S.formCard}>
            <div style={S.formHead}>أنشئ ملفك كعامل</div>
            <form onSubmit={handleSubmit}>

              {[
                ["name",  "الاسم الكامل",       "text",   "مثال: أحمد سالم"],
                ["price", "السعر بالساعة (MRU)", "number", "مثال: 15"],
                ["phone", "رقم الهاتف",          "tel",    "+222 XX XX XX XX"],
              ].map(([n, l, t, ph]) => (
                <div style={S.fg} key={n}>
                  <label style={S.fl}>{l}</label>
                  <input
                    name={n} type={t} placeholder={ph} required
                    value={form[n]} onChange={set} style={S.fi}
                  />
                </div>
              ))}

              <div style={S.fg}>
                <label style={S.fl}>التخصص</label>
                <select
                  name="specialty" required
                  value={form.specialty} onChange={set}
                  style={S.fi}
                >
                  <option value="">اختر تخصصك…</option>
                  {SPECIALTIES.map(s => (
                    <option key={s} value={s}>{SPEC_ICON[s]}  {s}</option>
                  ))}
                </select>
              </div>

              <button type="submit" style={S.btnSub} disabled={loading}>
                {loading ? "جارٍ الإرسال…" : "إرسال الطلب ←"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const FONT = "'Cairo', 'Noto Kufi Arabic', sans-serif"

const S = {
  page: {
    fontFamily: FONT,
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
  },

  /* success */
  succWrap: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 20,
    padding: "3rem 2.5rem",
    maxWidth: 440,
    textAlign: "center",
  },
  succRing: {
    width: 72, height: 72, borderRadius: "50%",
    background: "#EFF6FF",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 1.25rem",
  },
  succTitle: { fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 10px" },
  succSub:   { fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 },

  /* wrapper */
  wrapper: { width: "100%", maxWidth: 940 },

  /* hero banner */
  hero: {
    background: "linear-gradient(135deg, #1558F6 0%, #0e46d4 100%)",
    borderRadius: 20,
    padding: "2rem 2rem 1.75rem",
    color: "#fff",
    marginBottom: "1.5rem",
  },
  heroText:  { marginBottom: "1.25rem" },
  heroTitle: { fontSize: 22, fontWeight: 700, margin: "0 0 6px" },
  heroSub:   { fontSize: 14, opacity: 0.85, lineHeight: 1.7, margin: 0, maxWidth: 520 },
  heroItems: { display: "flex", flexWrap: "wrap", gap: "1rem" },
  heroItem:  { display: "flex", alignItems: "flex-start", gap: 10 },
  heroEm:    { fontSize: 22, lineHeight: 1 },
  heroItemT: { fontSize: 13, fontWeight: 700 },
  heroItemS: { fontSize: 12, opacity: 0.75 },

  /* two columns */
  cols: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.25rem",
  },

  /* perks card */
  perksCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    padding: "1.5rem",
  },
  perksHead: { fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: "1.1rem" },
  perksList: { display: "flex", flexDirection: "column", gap: "1rem" },
  perk:      { display: "flex", alignItems: "flex-start", gap: 12 },
  perkIcon: {
    width: 34, height: 34, borderRadius: 8,
    background: "#EFF6FF", color: "#1558F6",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  perkH: { fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 2px" },
  perkP: { fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 },

  /* form card */
  formCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    padding: "1.5rem",
  },
  formHead: { fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: "1.1rem" },

  fg: { marginBottom: "1rem" },
  fl: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 },
  fi: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #D1D5DB",
    borderRadius: 10,
    fontSize: 14,
    fontFamily: FONT,
    color: "#111827",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    direction: "rtl",
  },

  btnSub: {
    width: "100%",
    padding: "11px",
    background: "#1558F6",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    fontFamily: FONT,
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "background 0.18s",
  },
}