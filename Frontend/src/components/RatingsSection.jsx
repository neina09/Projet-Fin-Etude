import React, { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { createTaskRating, getMyWorkerProfile, getWorkerRatings } from "../api"

const ITEMS_PER_PAGE = 4

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={() => onChange((current) => Math.max(1, current - 1))}
        disabled={page === 1}
        className="pagination-btn"
      >
        <ChevronRight size={16} />
      </button>

      <div className="t-label px-3">
        الصفحة {page} من {totalPages}
      </div>

      <button
        type="button"
        onClick={() => onChange((current) => Math.min(totalPages, current + 1))}
        disabled={page === totalPages}
        className="pagination-btn"
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  )
}

const ReviewerAvatar = ({ name, imageUrl }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 text-xs font-black text-blue-600">
      {imageUrl ? (
        <img src={imageUrl} alt={name || "عميل"} className="h-full w-full object-cover" />
      ) : (
        name?.[0]?.toUpperCase() || "ع"
      )}
    </div>
    <span className="text-[11px] font-black text-slate-900">{name || "عميل مميز"}</span>
  </div>
)

export default function RatingsSection({ currentUser, myTasks = [], myOffers = [], onRefresh }) {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingError, setRatingError] = useState("")
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [taskToRate, setTaskToRate] = useState(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [ratingComment, setRatingComment] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)
  const [ratingsPage, setRatingsPage] = useState(1)
  const [secondaryPage, setSecondaryPage] = useState(1)

  const isWorker = currentUser?.role === "WORKER"

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true)
      setRatingError("")

      try {
        if (isWorker) {
          const profile = await getMyWorkerProfile()
          if (profile?.id) {
            const data = await getWorkerRatings(profile.id)
            setRatings(Array.isArray(data) ? data : [])
          } else {
            setRatings([])
          }
        } else {
          setRatings([])
        }
      } catch {
        setRatingError("تعذر تحميل التقييمات.")
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [isWorker])

  const completedTasks = myTasks.filter((task) => String(task.status).toUpperCase() === "COMPLETED")
  const unratedTasks = completedTasks.filter((task) => !task.rated && !task.isRated && task.assignedWorkerId)
  const ratedTasks = completedTasks.filter((task) => task.rated || task.isRated || !task.assignedWorkerId)

  const mainList = isWorker ? ratings : unratedTasks
  const secondaryList = isWorker ? myOffers : ratedTasks
  const mainTotalPages = Math.max(1, Math.ceil(mainList.length / ITEMS_PER_PAGE))
  const secondaryTotalPages = Math.max(1, Math.ceil(secondaryList.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setRatingsPage((current) => Math.min(current, mainTotalPages))
  }, [mainTotalPages])

  useEffect(() => {
    setSecondaryPage((current) => Math.min(current, secondaryTotalPages))
  }, [secondaryTotalPages])

  const pagedMainList = useMemo(() => {
    const start = (ratingsPage - 1) * ITEMS_PER_PAGE
    return mainList.slice(start, start + ITEMS_PER_PAGE)
  }, [mainList, ratingsPage])

  const pagedSecondaryList = useMemo(() => {
    const start = (secondaryPage - 1) * ITEMS_PER_PAGE
    return secondaryList.slice(start, start + ITEMS_PER_PAGE)
  }, [secondaryList, secondaryPage])

  const handleRateSubmit = async () => {
    if (!taskToRate) return

    setSubmittingRating(true)
    try {
      await createTaskRating(taskToRate.id, { stars: ratingScore, comment: ratingComment })
      setRatingModalOpen(false)
      setTaskToRate(null)
      setRatingComment("")
      setRatingScore(5)
      if (onRefresh) await onRefresh()
    } catch (err) {
      alert("فشل التقييم: " + err.message)
    } finally {
      setSubmittingRating(false)
    }
  }

  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, rating) => acc + (Number(rating.stars) || 0), 0) / ratings.length).toFixed(1)
    : "5.0"

  return (
    <div className="page-shell" dir="rtl">
      <div className="card-lg mb-12 flex flex-col justify-between md:flex-row md:items-center">
        <div className="space-y-1">
          <h2 className="flex items-center gap-3 text-xl font-black text-slate-900">
            <Star className="fill-amber-500 text-amber-500" size={24} />
            {isWorker ? "سجل أدائي وتقييماتي" : "إدارة تقييمات الخدمة"}
          </h2>
          <p className="t-label italic">مراقبة الجودة والآراء المهنية مع صور أصحاب التقييم.</p>
        </div>

        {isWorker && (
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-3 shadow-sm md:mt-0">
            <div className="text-3xl font-black text-amber-500">{avgRating}</div>
            <div className="flex flex-col">
              <div className="flex gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star key={index} size={10} fill={index <= Math.round(Number(avgRating)) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="t-label">المعدل العام</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <h3 className="t-label">{isWorker ? "آراء العملاء" : "بانتظار تقييمك"}</h3>
          </div>

          <div className="space-y-4">
            {isWorker ? (
              loading ? (
                <div className="py-20 text-center text-[10px] font-black uppercase italic text-slate-300">جارٍ التحميل...</div>
              ) : ratingError ? (
                <div className="empty-state">{ratingError}</div>
              ) : ratings.length === 0 ? (
                <div className="empty-state">لا توجد مراجعات حاليًا.</div>
              ) : (
                <>
                  {pagedMainList.map((rating) => (
                    <div key={rating.id} className="card">
                      <div className="mb-4 flex items-center justify-between">
                        <ReviewerAvatar name={rating.userName} imageUrl={rating.userImageUrl} />
                        <span className="badge badge-amber">
                          <Star size={10} fill="currentColor" /> {rating.stars}
                        </span>
                      </div>
                      <p className="border-r-2 border-slate-100 pr-4 text-xs font-bold italic leading-relaxed text-slate-400">
                        "{rating.comment || "تقييم إيجابي بدون تعليق مكتوب."}"
                      </p>
                    </div>
                  ))}
                  <Pagination page={ratingsPage} totalPages={mainTotalPages} onChange={setRatingsPage} />
                </>
              )
            ) : unratedTasks.length === 0 ? (
              <div className="empty-state">تم تقييم جميع المهام بنجاح.</div>
            ) : (
              <>
                {pagedMainList.map((task) => (
                  <div key={task.id} className="card group flex items-center justify-between">
                    <div>
                      <p className="mb-0.5 text-xs font-black text-slate-900">{task.title}</p>
                      <p className="text-[10px] font-bold text-slate-400">المنفذ: {task.workerName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTaskToRate(task)
                        setRatingModalOpen(true)
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      قيّم الآن
                    </button>
                  </div>
                ))}
                <Pagination page={ratingsPage} totalPages={mainTotalPages} onChange={setRatingsPage} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-slate-200" />
            <h3 className="t-label">{isWorker ? "العروض النشطة" : "أرشيف السجل"}</h3>
          </div>

          <div className="space-y-4">
            {isWorker ? (
              secondaryList.length === 0 ? (
                <div className="empty-state">لا توجد عروض حاليًا.</div>
              ) : (
                <>
                  {pagedSecondaryList.map((offer) => (
                    <div key={offer.id} className="card">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-900">{offer.taskTitle}</span>
                        <span className={`rounded-lg border px-3 py-1 text-[8px] font-black ${
                          offer.status === "SELECTED"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                            : "border-blue-100 bg-blue-50 text-blue-600"
                        }`}>
                          {offer.status === "SELECTED" ? "تم الاختيار" : "قيد الدراسة"}
                        </span>
                      </div>
                      <p className="t-label italic">"{offer.message}"</p>
                    </div>
                  ))}
                  <Pagination page={secondaryPage} totalPages={secondaryTotalPages} onChange={setSecondaryPage} />
                </>
              )
            ) : secondaryList.length === 0 ? (
              <div className="empty-state">الأرشيف فارغ حاليًا.</div>
            ) : (
              <>
                {pagedSecondaryList.map((task) => (
                  <div key={task.id} className="card flex items-center justify-between border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <div>
                        <p className="text-xs font-black text-slate-800">{task.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">مكتمل ومؤرشف</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Pagination page={secondaryPage} totalPages={secondaryTotalPages} onChange={setSecondaryPage} />
              </>
            )}
          </div>
        </div>
      </div>

      {ratingModalOpen && taskToRate && (
        <div className="modal-overlay" dir="rtl">
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between p-8 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">تقييم الخدمة</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{taskToRate.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setRatingModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="space-y-8 p-8">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setRatingScore(score)}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                      ratingScore >= score
                        ? "border-amber-100 bg-amber-50 text-amber-500"
                        : "border-slate-100 bg-slate-50 text-slate-200"
                    }`}
                  >
                    <Star size={20} fill={ratingScore >= score ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>

              <textarea
                value={ratingComment}
                onChange={(event) => setRatingComment(event.target.value)}
                placeholder="كيف كانت الجودة؟ أضف رأيك هنا..."
                className="input h-28 resize-none"
              />

              <button
                type="button"
                onClick={handleRateSubmit}
                disabled={submittingRating}
                className="btn btn-primary btn-lg w-full"
              >
                {submittingRating ? "جارٍ الحفظ..." : "تأكيد والتقييم الآن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
