import React, { useState, useEffect, useMemo } from "react"
import {
  LogOut, Settings, Briefcase, Eye, FileText,
  TrendingUp, ArrowUpRight, Wrench, Bell, MessageCircle,
} from "lucide-react"
import { getMe } from "../api"
import logo from "../assets/logo.png"

// ── Components ──
import SearchBar   from "./SearchBar"
import WorkerCard  from "./WorkerCard"
import BecomeWorker from "./BecomeWorker"

/* ─────────────────────────────────────────
   MOCK DATA
   Replace with real API data.
   worker.img  → your API field (e.g. worker.avatar_url)
   worker.top  → boolean from API
───────────────────────────────────────── */
const MOCK_WORKERS = [
  { id:1, name:"Ahmed Salim",    specialty:"Plumber",     rating:4.8, reviews:124, price:15, available:true,  jobs:87,  location:"Nouakchott", img:"https://randomuser.me/api/portraits/men/32.jpg",   top:true  },
  { id:2, name:"Fatima Ndiaye",  specialty:"Electrician", rating:4.6, reviews:89,  price:20, available:true,  jobs:61,  location:"Nouakchott", img:"https://randomuser.me/api/portraits/women/44.jpg", top:false },
  { id:3, name:"Omar Coulibaly", specialty:"Painter",     rating:4.9, reviews:201, price:12, available:false, jobs:143, location:"Rosso",      img:"https://randomuser.me/api/portraits/men/75.jpg",   top:true  },
  { id:4, name:"Mariam Ba",      specialty:"Cleaner",     rating:4.5, reviews:67,  price:10, available:true,  jobs:39,  location:"Kiffa",       img:"https://randomuser.me/api/portraits/women/68.jpg", top:false },
  { id:5, name:"Ibrahima Diop",  specialty:"Plumber",     rating:4.7, reviews:98,  price:18, available:true,  jobs:72,  location:"Nouakchott", img:"https://randomuser.me/api/portraits/men/54.jpg",   top:false },
  { id:6, name:"Aisha Keita",    specialty:"Painter",     rating:4.3, reviews:44,  price:11, available:false, jobs:28,  location:"Zouerate",   img:"https://randomuser.me/api/portraits/women/29.jpg", top:false },
]

const SPECIALTIES = ["All", "Plumber", "Electrician", "Painter", "Cleaner"]
const SPEC_ICON   = { All:"◈", Plumber:"🔧", Electrician:"⚡", Painter:"🎨", Cleaner:"✦" }

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const CSS = `
@import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800,900&f[]=satoshi@400,500,600,700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --white:#ffffff;
  --bg:#F7F8FA;--bg2:#EEF0F5;
  --border:#E3E6ED;--border2:#CDD2DC;
  --ink:#0D1117;--ink2:#2D3748;--ink3:#64748B;--ink4:#94A3B8;--ink5:#CBD5E1;
  --blue:#1558F6;--blue-h:#0D47E0;--blue-lt:#EEF3FF;--blue-ring:rgba(21,88,246,.16);
  --teal:#0694A2;--teal-lt:#E0F7FA;
  --green:#059669;--green-lt:#D1FAE5;--green-txt:#065F46;
  --amber:#D97706;--amber-lt:#FEF3C7;
  --red:#DC2626;--red-lt:#FEE2E2;
  --gold:#F59E0B;
  --r-xs:5px;--r-sm:8px;--r:12px;--r-lg:16px;--r-xl:22px;--r-2xl:28px;
  --sh-xs:0 1px 2px rgba(13,17,23,.06);
  --sh-sm:0 2px 6px rgba(13,17,23,.08),0 1px 2px rgba(13,17,23,.05);
  --sh:0 4px 16px rgba(13,17,23,.09),0 1px 4px rgba(13,17,23,.05);
  --sh-md:0 12px 28px rgba(13,17,23,.12),0 2px 8px rgba(13,17,23,.06);
  --sh-lg:0 24px 56px rgba(13,17,23,.16),0 4px 12px rgba(13,17,23,.07);
  --sh-blue:0 4px 16px rgba(21,88,246,.35);
  --font:'Satoshi',-apple-system,BlinkMacSystemFont,sans-serif;
  --font-h:'Cabinet Grotesk','Satoshi',sans-serif;
}
body{font-family:var(--font);background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;min-height:100vh}
button,input,select{font-family:var(--font)}
img{display:block}

/* ── TOPBAR ── */
.topbar{background:var(--ink);height:38px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;font-size:11.5px;color:rgba(255,255,255,.45)}
.tb-brand{display:flex;align-items:center;gap:8px;color:#fff;font-family:var(--font-h);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.14em}
.tb-pulse{width:7px;height:7px;border-radius:50%;background:var(--blue);box-shadow:0 0 0 2px rgba(21,88,246,.3);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 2px rgba(21,88,246,.3)}50%{box-shadow:0 0 0 5px rgba(21,88,246,.08)}}
.tb-email{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:3px 12px;font-size:11px}

/* ── NAVBAR ── */
.navbar{background:var(--white);border-bottom:1px solid var(--border);height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 32px;position:sticky;top:0;z-index:200;box-shadow:var(--sh-xs)}
.nb-left{display:flex;align-items:center;gap:32px}
.nb-logo{display:flex;align-items:center;gap:10px;cursor:pointer}
.nb-logo img{width:34px;height:34px;border-radius:9px;object-fit:cover}
.nb-logo-name{font-family:var(--font-h);font-size:19px;font-weight:900;color:var(--ink);letter-spacing:-.04em}
.nb-logo-name b{color:var(--blue)}
.nb-divider{width:1px;height:22px;background:var(--border)}
.nb-tabs{display:flex;align-items:center;gap:2px}
.nb-tab{background:none;border:none;cursor:pointer;padding:8px 14px;border-radius:var(--r-sm);font-size:14px;font-weight:500;color:var(--ink3);transition:background .14s,color .14s;white-space:nowrap}
.nb-tab:hover{background:var(--bg);color:var(--ink2)}
.nb-tab.on{background:var(--blue-lt);color:var(--blue);font-weight:600}
.nb-right{display:flex;align-items:center;gap:10px}
.nb-ico{width:38px;height:38px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;background:none;border:1px solid var(--border);cursor:pointer;color:var(--ink3);transition:all .14s;position:relative}
.nb-ico:hover{background:var(--bg);color:var(--ink);border-color:var(--border2)}
.nb-ico-dot::after{content:'';position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:var(--red);border:2px solid var(--white)}
.nb-avatar{width:38px;height:38px;border-radius:50%;background:var(--blue-lt);border:2px solid var(--blue);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--blue);cursor:pointer}
.btn-post{display:flex;align-items:center;gap:7px;background:var(--blue);color:#fff;border:none;cursor:pointer;padding:9px 20px;border-radius:var(--r-sm);font-size:13.5px;font-weight:700;box-shadow:var(--sh-blue);transition:all .15s;white-space:nowrap}
.btn-post:hover{background:var(--blue-h);transform:translateY(-1px);box-shadow:0 8px 24px rgba(21,88,246,.42)}

/* ── PAGE ── */
.page{max-width:1120px;margin:0 auto;padding:36px 32px}

/* ── HERO BANNER ── */
.hero-banner{border-radius:var(--r-xl);overflow:hidden;background:linear-gradient(130deg,#0a1628 0%,#0c2040 35%,#1558F6 75%,#4B83FF 100%);padding:36px 40px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;position:relative}
.hero-banner::before{content:'';position:absolute;top:-80px;right:200px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(75,131,255,.25),transparent 70%);pointer-events:none}
.hero-banner::after{content:'';position:absolute;bottom:-60px;right:-60px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.04);pointer-events:none}
.hero-text{position:relative;z-index:1}
.hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:4px 12px;font-size:11.5px;font-weight:600;color:rgba(255,255,255,.8);letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px}
.hero-title{font-family:var(--font-h);font-size:28px;font-weight:900;color:#fff;letter-spacing:-.03em;line-height:1.2;margin-bottom:8px}
.hero-sub{font-size:14.5px;color:rgba(255,255,255,.68);line-height:1.6;max-width:420px}
.hero-actions{display:flex;gap:10px;margin-top:22px}
.btn-hero-primary{background:#fff;color:var(--blue);border:none;cursor:pointer;padding:10px 22px;border-radius:var(--r-sm);font-size:13.5px;font-weight:700;transition:all .15s}
.btn-hero-primary:hover{background:var(--blue-lt);transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,.18)}
.btn-hero-ghost{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.22);cursor:pointer;padding:10px 22px;border-radius:var(--r-sm);font-size:13.5px;font-weight:600;transition:all .15s;backdrop-filter:blur(4px)}
.btn-hero-ghost:hover{background:rgba(255,255,255,.2)}
.hero-stats{position:relative;z-index:1;display:flex;flex-direction:column;gap:12px;flex-shrink:0}
.hero-stat{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(10px);border-radius:var(--r-lg);padding:16px 24px;text-align:center;min-width:120px}
.hs-num{font-family:var(--font-h);font-size:26px;font-weight:900;color:#fff;letter-spacing:-.04em}
.hs-lbl{font-size:11px;color:rgba(255,255,255,.62);font-weight:500;margin-top:2px;text-transform:uppercase;letter-spacing:.06em}

/* ── STATS ── */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);padding:22px;transition:box-shadow .2s,transform .2s;cursor:default}
.stat-card:hover{box-shadow:var(--sh);transform:translateY(-2px)}
.sc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
.sc-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center}
.sc-icon.blue{background:var(--blue-lt);color:var(--blue)}
.sc-icon.green{background:var(--green-lt);color:var(--green)}
.sc-icon.teal{background:var(--teal-lt);color:var(--teal)}
.sc-badge{display:flex;align-items:center;gap:3px;font-size:11.5px;font-weight:600;background:var(--green-lt);color:var(--green-txt);padding:3px 8px;border-radius:20px}
.sc-num{font-family:var(--font-h);font-size:32px;font-weight:900;color:var(--ink);letter-spacing:-.04em;line-height:1;margin-bottom:3px}
.sc-lbl{font-size:13px;color:var(--ink3);font-weight:500}

/* ── QUICK ACTIONS ── */
.qa-row{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.qa-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);padding:20px 22px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:box-shadow .18s,border-color .18s,transform .18s}
.qa-card:hover{box-shadow:var(--sh);border-color:var(--blue);transform:translateY(-2px)}
.qa-icon{width:50px;height:50px;border-radius:14px;font-size:24px;background:var(--blue-lt);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.qa-body h3{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:3px}
.qa-body p{font-size:13px;color:var(--ink3);line-height:1.5}
.qa-arrow{margin-left:auto;color:var(--ink5);flex-shrink:0;transition:transform .18s,color .18s}
.qa-card:hover .qa-arrow{transform:translate(3px,-3px);color:var(--blue)}

/* ── WORKERS PAGE ── */
.wk-page-header{margin-bottom:24px}
.wk-page-title{font-family:var(--font-h);font-size:22px;font-weight:900;color:var(--ink);letter-spacing:-.025em;margin-bottom:4px}
.wk-page-sub{font-size:14px;color:var(--ink3)}

/* SearchBar styles */
.search-bar-row{display:flex;align-items:center;gap:10px;background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);padding:10px 16px;margin-bottom:18px;box-shadow:var(--sh-xs)}
.search-bar-row .s-icon{color:var(--ink4);flex-shrink:0}
.search-bar-row input{flex:1;border:none;outline:none;font-size:14.5px;color:var(--ink);background:transparent}
.search-bar-row input::placeholder{color:var(--ink4)}
.s-divider{width:1px;height:22px;background:var(--border);margin:0 4px}
.btn-filter{display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-size:13.5px;font-weight:600;color:var(--ink2);padding:4px 8px;border-radius:var(--r-sm);transition:background .14s;white-space:nowrap}
.btn-filter:hover{background:var(--bg)}

/* Filter chips */
.filter-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.chip{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:var(--r-2xl);border:1.5px solid var(--border);background:var(--white);font-size:13px;font-weight:600;color:var(--ink3);cursor:pointer;transition:all .14s;user-select:none}
.chip:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-lt)}
.chip.on{background:var(--blue);color:#fff;border-color:var(--blue);box-shadow:var(--sh-blue)}

/* Workers grid */
.wk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.wk-empty{grid-column:1/-1;padding:72px;text-align:center}
.wk-empty-em{font-size:42px;margin-bottom:12px}
.wk-empty-txt{font-size:15px;color:var(--ink3)}

/* ── WORKER CARD styles (used by WorkerCard.jsx) ── */
.wk-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .24s,transform .24s,border-color .24s;position:relative}
.wk-card:hover{box-shadow:var(--sh-lg);transform:translateY(-6px);border-color:transparent}
.wk-img-wrap{height:176px;overflow:hidden;position:relative;background:linear-gradient(135deg,#dde3ef,#c8d0e0);flex-shrink:0}
.wk-img{width:100%;height:100%;object-fit:cover;object-position:top center;transition:transform .4s ease;display:block}
.wk-card:hover .wk-img{transform:scale(1.07)}
.wk-img-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(13,17,23,.6) 100%)}
.wk-status{position:absolute;top:12px;right:12px;display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:4px 11px;border-radius:20px;backdrop-filter:blur(8px);letter-spacing:.02em}
.wk-status.av{background:rgba(5,150,105,.88);color:#fff}
.wk-status.bz{background:rgba(107,114,128,.82);color:#fff}
.wk-status-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
.wk-save-btn{position:absolute;top:12px;left:12px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.18);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;color:rgba(255,255,255,.85)}
.wk-save-btn:hover{background:rgba(255,255,255,.32);color:#fff}
.wk-save-btn.saved{background:var(--red);border-color:var(--red);color:#fff}
.wk-top-badge{position:absolute;bottom:10px;left:12px;display:inline-flex;align-items:center;gap:4px;background:rgba(21,88,246,.88);backdrop-filter:blur(6px);color:#fff;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.04em;text-transform:uppercase}
.wk-body{padding:16px 18px;flex:1;display:flex;flex-direction:column}
.wk-body-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:5px}
.wk-name{font-family:var(--font-h);font-size:15.5px;font-weight:800;color:var(--ink);letter-spacing:-.02em}
.wk-verify{color:var(--blue);flex-shrink:0;margin-top:1px}
.wk-meta-row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.wk-spec-tag{display:inline-flex;align-items:center;gap:4px;background:var(--blue-lt);color:var(--blue);font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.06em}
.wk-loc{display:flex;align-items:center;gap:3px;font-size:12px;color:var(--ink4)}
.wk-divider{height:1px;background:var(--border);margin-bottom:12px}
.wk-bottom{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.wk-rating-row{display:flex;align-items:center;gap:4px}
.wk-stars{display:flex;gap:1px}
.wk-star{color:var(--gold);fill:var(--gold)}
.wk-star-e{color:var(--ink5)}
.wk-rat-num{font-size:13px;font-weight:700;color:var(--ink);margin-left:2px}
.wk-rat-cnt{font-size:12px;color:var(--ink4)}
.wk-price-col{text-align:right}
.wk-price{font-family:var(--font-h);font-size:18px;font-weight:900;color:var(--ink);letter-spacing:-.025em}
.wk-price-lbl{font-size:11px;color:var(--ink4);font-weight:400}
.btn-hire{width:100%;height:40px;border-radius:var(--r-sm);border:none;font-size:13.5px;font-weight:700;cursor:pointer;transition:all .15s}
.btn-hire.go{background:var(--blue);color:#fff;box-shadow:0 2px 8px rgba(21,88,246,.25)}
.btn-hire.go:hover{background:var(--blue-h);box-shadow:var(--sh-blue);transform:translateY(-1px)}
.btn-hire.no{background:var(--bg2);color:var(--ink4);cursor:not-allowed}

/* ── BECOME WORKER styles (used by BecomeWorker.jsx) ── */
.bw-wrapper{max-width:1000px}
.bw-hero{border-radius:var(--r-xl);background:linear-gradient(130deg,#0a1628,#0f2a4a 40%,#1558F6 85%,#5B92FF);padding:36px 40px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.bw-hero::before{content:'';position:absolute;top:-80px;right:260px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(91,146,255,.2),transparent 70%)}
.bw-hero-text{position:relative;z-index:1}
.bw-hero-text h2{font-family:var(--font-h);font-size:26px;font-weight:900;color:#fff;letter-spacing:-.03em;margin-bottom:8px}
.bw-hero-text p{font-size:14.5px;color:rgba(255,255,255,.7);line-height:1.65;max-width:400px}
.bw-hero-items{position:relative;z-index:1;display:flex;flex-direction:column;gap:10px}
.bw-hi{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);border-radius:var(--r);padding:11px 18px}
.bw-hi-em{font-size:20px}
.bw-hi-t{font-size:13px;font-weight:600;color:#fff}
.bw-hi-s{font-size:11.5px;color:rgba(255,255,255,.6);margin-top:1px}
.bw-cols{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.perks-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);padding:26px}
.perks-head{font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--ink);margin-bottom:20px}
.perks-list{display:flex;flex-direction:column;gap:18px}
.perk{display:flex;gap:13px;align-items:flex-start}
.perk-icon{width:38px;height:38px;border-radius:10px;background:var(--blue-lt);display:flex;align-items:center;justify-content:center;color:var(--blue);flex-shrink:0}
.perk h4{font-size:13.5px;font-weight:700;color:var(--ink);margin-bottom:2px}
.perk p{font-size:12.5px;color:var(--ink3);line-height:1.55}
.form-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);padding:28px;box-shadow:var(--sh)}
.form-head{font-family:var(--font-h);font-size:15px;font-weight:800;color:var(--ink);margin-bottom:22px}
.fg{margin-bottom:16px}
.fl{display:block;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--ink3);margin-bottom:6px}
.fi{width:100%;height:43px;padding:0 14px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-size:14px;color:var(--ink);background:var(--bg);outline:none;transition:border-color .14s,box-shadow .14s,background .14s}
.fi:focus{border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-ring);background:var(--white)}
.fi::placeholder{color:var(--ink4)}
select.fi{cursor:pointer;appearance:none}
.btn-sub{width:100%;height:44px;background:var(--blue);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;font-size:14.5px;font-weight:700;margin-top:6px;box-shadow:var(--sh-blue);transition:all .15s}
.btn-sub:hover{background:var(--blue-h);transform:translateY(-1px);box-shadow:0 10px 28px rgba(21,88,246,.42)}
.btn-sub:disabled{opacity:.7;cursor:not-allowed;transform:none}
.succ-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:65vh;text-align:center}
.succ-ring{width:76px;height:76px;border-radius:50%;background:var(--green-lt);display:flex;align-items:center;justify-content:center;margin-bottom:22px;color:var(--green)}
.succ-wrap h2{font-family:var(--font-h);font-size:24px;font-weight:900;color:var(--ink);letter-spacing:-.025em;margin-bottom:8px}
.succ-wrap p{font-size:14.5px;color:var(--ink3);max-width:340px;line-height:1.65}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.page>*{animation:fadeUp .34s ease both}
.page>*:nth-child(2){animation-delay:.07s}
.page>*:nth-child(3){animation-delay:.13s}
.page>*:nth-child(4){animation-delay:.19s}
.wk-grid>.wk-card:nth-child(1){animation:fadeUp .3s ease both}
.wk-grid>.wk-card:nth-child(2){animation:fadeUp .3s ease .06s both}
.wk-grid>.wk-card:nth-child(3){animation:fadeUp .3s ease .12s both}
.wk-grid>.wk-card:nth-child(4){animation:fadeUp .3s ease .18s both}
.wk-grid>.wk-card:nth-child(5){animation:fadeUp .3s ease .24s both}
.wk-grid>.wk-card:nth-child(6){animation:fadeUp .3s ease .30s both}
`

/* ─────────────── Workers Section ─────────────── */
function WorkersSection() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const filtered = useMemo(() =>
    MOCK_WORKERS.filter(w =>
      (w.name.toLowerCase().includes(search.toLowerCase()) ||
       w.specialty.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "All" || w.specialty === filter)
    ), [search, filter])

  return (
    <div className="page">
      <div className="wk-page-header">
        <div className="wk-page-title">Find a Professional</div>
        <div className="wk-page-sub">{filtered.length} workers available near you</div>
      </div>

      {/* ↓ SearchBar component */}
      <SearchBar value={search} onChange={setSearch} />

      <div className="filter-chips">
        {SPECIALTIES.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`chip ${filter === s ? "on" : ""}`}>
            {SPEC_ICON[s]} {s}
          </button>
        ))}
      </div>

      <div className="wk-grid">
        {filtered.length
          ? filtered.map(w => (
              /* ↓ WorkerCard component */
              <WorkerCard key={w.id} worker={w} />
            ))
          : (
            <div className="wk-empty">
              <div className="wk-empty-em">🔍</div>
              <div className="wk-empty-txt">No workers match your search.</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function Dashboard({ onLogout }) {
  const [user, setUser]   = useState(null)
  const [page, setPage]   = useState("dashboard")

  useEffect(() => { getMe().then(setUser).catch(onLogout) }, [onLogout])

  const onlineCount = MOCK_WORKERS.filter(w => w.available).length

  return (
    <>
      <style>{CSS}</style>

      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="tb-brand"><div className="tb-pulse"/>chghloni</div>
        <span className="tb-email">{user?.email || "—"}</span>
      </div>

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nb-left">
          <div className="nb-logo" onClick={() => setPage("dashboard")}>
            <img src={logo} alt="logo"/>
            <span className="nb-logo-name">chgh<b>loni</b></span>
          </div>
          <div className="nb-divider"/>
          <div className="nb-tabs">
            {[["dashboard","Dashboard"],["workers","Find Workers"]].map(([id,lbl]) => (
              <button key={id} className={`nb-tab ${page === id ? "on":""}`} onClick={() => setPage(id)}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <div className="nb-right">
          {/* ↓ Navigates to BecomeWorker component */}
          <button className="btn-post" onClick={() => setPage("becomeWorker")}>
            <Wrench size={14}/> انضم كعامل
          </button>
          <button className="nb-ico nb-ico-dot"><Bell size={15}/></button>
          <button className="nb-ico"><MessageCircle size={15}/></button>
          <div className="nb-avatar">{user?.username?.[0]?.toUpperCase() || "U"}</div>
        </div>
      </nav>

      {/* ── Dashboard Page ── */}
      {page === "dashboard" && (
        <div className="page">
          <div className="hero-banner">
            <div className="hero-text">
              <div className="hero-tag">✦ Platform Overview</div>
              <div className="hero-title">Welcome back, {user?.username || "there"} 👋</div>
              <div className="hero-sub">Manage your jobs, track applications, and connect with top professionals.</div>
              <div className="hero-actions">
                <button className="btn-hero-primary" onClick={() => setPage("workers")}>Browse Workers</button>
                <button className="btn-hero-ghost"   onClick={() => setPage("becomeWorker")}>Become a Worker</button>
              </div>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hs-num">{onlineCount}</div>
                <div className="hs-lbl">Online Now</div>
              </div>
              <div className="hero-stat">
                <div className="hs-num">4.8</div>
                <div className="hs-lbl">Avg. Rating</div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            {[
              { icon:<Briefcase size={18}/>, cls:"blue",  num:"0", lbl:"Active Jobs"   },
              { icon:<FileText size={18}/>,  cls:"green", num:"0", lbl:"Applications"  },
              { icon:<Eye size={18}/>,       cls:"teal",  num:"0", lbl:"Profile Views" },
            ].map((s,i) => (
              <div className="stat-card" key={i}>
                <div className="sc-top">
                  <div className={`sc-icon ${s.cls}`}>{s.icon}</div>
                  <div className="sc-badge"><TrendingUp size={10}/>0%</div>
                </div>
                <div className="sc-num">{s.num}</div>
                <div className="sc-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="qa-row">
            <div className="qa-card" onClick={() => setPage("workers")}>
              <div className="qa-icon">🔎</div>
              <div className="qa-body"><h3>Find a Worker</h3><p>Browse vetted professionals available near you right now.</p></div>
              <ArrowUpRight size={17} className="qa-arrow"/>
            </div>
            <div className="qa-card" onClick={() => setPage("becomeWorker")}>
              <div className="qa-icon">🛠️</div>
              <div className="qa-body"><h3>Become a Worker</h3><p>Join the network and start receiving job requests today.</p></div>
              <ArrowUpRight size={17} className="qa-arrow"/>
            </div>
          </div>
        </div>
      )}

    
      {/* ── Workers Page (uses SearchBar + WorkerCard) ── */}
      {page === "workers" && <WorkersSection />}

      {/* ── BecomeWorker Page ── */}
      {/* ↓ BecomeWorker component */}
      {page === "becomeWorker" && <BecomeWorker />}

    </>
  )
}