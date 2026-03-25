import React, { useState } from "react"
import { Star, MapPin, BadgeCheck, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const WORKERS = [
  {
    id: 1,
    name: "أحمد سالم",
    specialty: "سباك",
    rating: 4.8,
    reviews: 124,
    price: 15,
    available: true,
    location: "نواكشوط",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    top: true,
  },
  {
    id: 2,
    name: "فاطمة اندياي",
    specialty: "كهربائي",
    rating: 4.6,
    reviews: 89,
    price: 20,
    available: true,
    location: "نواكشوط",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    top: false,
  },
  {
    id: 3,
    name: "محمد ولد أحمد",
    specialty: "دهان",
    rating: 4.5,
    reviews: 61,
    price: 12,
    available: false,
    location: "نواكشوط",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    top: false,
  },
  {
    id: 4,
    name: "مريم بنت سيدي",
    specialty: "تنظيف",
    rating: 4.9,
    reviews: 210,
    price: 10,
    available: true,
    location: "نواكشوط",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    top: true,
  },
]

const FILTERS = ["الكل", "سباك", "كهربائي", "دهان", "تنظيف"]
const ICONS = { الكل: "◈", سباك: "🔧", كهربائي: "⚡", دهان: "🎨", تنظيف: "✦" }

function Stars({ rating }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={13}
          style={{
            fill: i <= Math.round(rating) ? "#F59E0B" : "none",
            color: i <= Math.round(rating) ? "#F59E0B" : "#CBD5E1",
          }}
        />
      ))}
    </div>
  )
}

export default function FeaturedWorkers() {
  const [filter, setFilter] = useState("الكل")
  const navigate = useNavigate()

  const filtered = WORKERS.filter(
    w => filter === "الكل" || w.specialty === filter
  )

  return (
    <section style={S.section}>

      {/* العنوان */}
      <div style={S.header}>
        <div style={S.tag}>✦ عمال موثوقون</div>
        <h2 style={S.title}>أفضل العمال لدينا</h2>
        <p style={S.sub}>عمال مهرة ومجربون جاهزون لخدمتك بالقرب منك.</p>
      </div>

      {/* الفلترة */}
      <div style={S.chips}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...S.chip, ...(filter === f ? S.chipOn : {}) }}
          >
            {ICONS[f]} {f}
          </button>
        ))}
      </div>

      {/* عرض العمال */}
      <div style={S.grid}>
        {filtered.map(w => (
          <div key={w.id} style={S.card}>

            <div style={S.imgWrap}>
              <img src={w.img} alt={w.name} style={S.img} />
              {w.top && <div style={S.topBadge}>⭐ الأفضل</div>}
              <div style={{ ...S.status, ...(w.available ? S.statusAv : S.statusBz) }}>
                {w.available ? "متاح" : "مشغول"}
              </div>
            </div>

            <div style={S.body}>
              <div style={S.nameRow}>
                <span style={S.name}>{w.name}</span>
                <BadgeCheck size={15} style={{ color: "#1558F6" }} />
              </div>

              <div style={S.metaRow}>
                <span style={S.specTag}>{ICONS[w.specialty]} {w.specialty}</span>
                <span style={S.loc}>
                  <MapPin size={11} /> {w.location}
                </span>
              </div>

              <div style={S.bottomRow}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Stars rating={w.rating} />
                  <span style={S.ratingNum}>{w.rating}</span>
                </div>
                <span style={S.price}>{w.price} MRU</span>
              </div>

              <button style={S.hireBtn} onClick={() => navigate("/auth")}>
                تواصل الآن <ArrowLeft size={14} />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* زر عرض الكل */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button style={S.seeAll}>
          <ArrowLeft size={15} /> عرض جميع العمال
        </button>
      </div>

    </section>
  )
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  section: {
    direction: "rtl",
    fontFamily: "'Cairo', 'Noto Kufi Arabic', sans-serif",
    padding: "3rem 1.5rem",
    maxWidth: 900,
    margin: "0 auto",
  },

  /* header */
  header: { textAlign: "center", marginBottom: "2rem" },
  tag: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 700,
    color: "#B45309",
    background: "#FEF3C7",
    padding: "4px 14px",
    borderRadius: 20,
    marginBottom: 10,
    letterSpacing: "0.06em",
  },
  title: {
    fontFamily: "'Noto Kufi Arabic', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "#111827",
  },
  sub: { fontSize: 15, color: "#6B7280", margin: 0 },

  /* chips */
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: "2rem",
  },
  chip: {
    fontFamily: "'Cairo', sans-serif",
    fontSize: 13,
    padding: "6px 16px",
    borderRadius: 20,
    border: "1px solid #E5E7EB",
    background: "#fff",
    color: "#6B7280",
    cursor: "pointer",
    transition: "all 0.18s",
  },
  chipOn: {
    background: "#1558F6",
    color: "#fff",
    borderColor: "#1558F6",
  },

  /* grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.25rem",
  },

  /* card */
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    overflow: "hidden",
    transition: "transform 0.18s",
  },

  /* image zone */
  imgWrap: { position: "relative" },
  img: { width: "100%", height: 180, objectFit: "cover", display: "block" },
  topBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#F59E0B",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 12,
  },
  status: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 12,
  },
  statusAv: { background: "#D1FAE5", color: "#065F46" },
  statusBz: { background: "#FEE2E2", color: "#991B1B" },

  /* card body */
  body: { padding: "1rem 1.1rem" },
  nameRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
  name: { fontSize: 16, fontWeight: 700, color: "#111827" },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  specTag: {
    fontSize: 12,
    padding: "3px 10px",
    background: "#EFF6FF",
    color: "#1D4ED8",
    borderRadius: 10,
  },
  loc: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    fontSize: 12,
    color: "#9CA3AF",
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ratingNum: { fontSize: 13, fontWeight: 600, color: "#374151", marginRight: 4 },
  price: { fontSize: 14, fontWeight: 700, color: "#1558F6" },

  hireBtn: {
    width: "100%",
    padding: "9px",
    borderRadius: 8,
    background: "#1558F6",
    color: "#fff",
    border: "none",
    fontFamily: "'Cairo', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  /* see all */
  seeAll: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'Cairo', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: "#1558F6",
    background: "transparent",
    border: "1px solid #1558F6",
    padding: "10px 28px",
    borderRadius: 24,
    cursor: "pointer",
  },
}