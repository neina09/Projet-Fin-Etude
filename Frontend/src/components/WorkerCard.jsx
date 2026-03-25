import React, { useState } from "react"
import { Star, BadgeCheck, MapPin, Heart } from "lucide-react"

const SPEC_ICON = {
  All: "◈",
  Plumber: "🔧",
  Electrician: "⚡",
  Painter: "🎨",
  Cleaner: "✦",
}

// ─── Star Rating ───
function Stars({ rating }) {
  return (
    <div className="wk-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? "wk-star" : "wk-star-e"}
          fill={i <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  )
}

/**
 * WorkerCard Component
 * Props:
 *  - worker : {
 *      id, name, specialty, rating, reviews,
 *      price, available, jobs, location,
 *      img,   ← comes from API (e.g. worker.avatar_url)
 *      top    ← boolean, top-rated badge
 *    }
 */
export default function WorkerCard({ worker }) {
  const [saved, setSaved] = useState(false)

  return (
    <div className="wk-card">

      {/* ── Photo ── */}
      <div className="wk-img-wrap">
        <img
          src={worker.img}
          alt={worker.name}
          className="wk-img"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&size=300&background=dde3ef&color=1558F6&font-size=0.38&bold=true`
          }}
        />
        <div className="wk-img-overlay" />

        {/* Status badge */}
        <span className={`wk-status ${worker.available ? "av" : "bz"}`}>
          <span className="wk-status-dot" />
          {worker.available ? "Available" : "Busy"}
        </span>

        {/* Save button */}
        <button
          className={`wk-save-btn ${saved ? "saved" : ""}`}
          onClick={() => setSaved(s => !s)}
        >
          <Heart size={13} fill={saved ? "#fff" : "none"} />
        </button>

        {/* Top Rated badge */}
        {worker.top && (
          <span className="wk-top-badge">
            <BadgeCheck size={10} /> Top Rated
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="wk-body">

        <div className="wk-body-top">
          <div className="wk-name">{worker.name}</div>
          <BadgeCheck size={16} className="wk-verify" />
        </div>

        <div className="wk-meta-row">
          <span className="wk-spec-tag">
            {SPEC_ICON[worker.specialty]} {worker.specialty}
          </span>
          <span className="wk-loc">
            <MapPin size={11} /> {worker.location}
          </span>
        </div>

        <div className="wk-divider" />

        <div className="wk-bottom">
          <div className="wk-rating-row">
            <Stars rating={worker.rating} />
            <span className="wk-rat-num">{worker.rating}</span>
            <span className="wk-rat-cnt">({worker.reviews})</span>
          </div>
          <div className="wk-price-col">
            <div className="wk-price">${worker.price}</div>
            <div className="wk-price-lbl">per hour</div>
          </div>
        </div>

        <button
          disabled={!worker.available}
          className={`btn-hire ${worker.available ? "go" : "no"}`}
        >
          {worker.available ? "Hire Now →" : "Currently Unavailable"}
        </button>

      </div>
    </div>
  )
}