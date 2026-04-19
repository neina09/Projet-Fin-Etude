import React from "react"
import { Wrench } from "lucide-react"

const STATUS_LABELS = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  COMPLETED: "مكتمل",
  REJECTED: "مرفوض",
  CANCELLED: "ملغي"
}

const btnPrimary = "h-10 rounded-2xl bg-[#1d4ed8] px-5 text-xs font-black text-white shadow-md shadow-blue-500/15 transition-all hover:bg-blue-700 active:scale-[0.98]"
const btnGhost = "h-10 rounded-2xl border border-slate-200 bg-white px-5 text-xs font-black text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"

export default function WorkerRequestsList({ requests, handleBookingAction }) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm" dir="rtl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1d4ed8]">
          <Wrench size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">طلبات العملاء</h2>
          <p className="text-sm font-bold text-slate-500">اقبل أو ارفض أو أكمل الطلبات من هنا.</p>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length ? (
          requests.map((request) => {
            const bookingStatus = String(request.status || "").toUpperCase()
            return (
              <div key={request.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{request.userName}</h3>
                    <p className="text-sm font-bold text-slate-500">
                      {request.description || "طلب خدمة"} - {request.address}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-black text-slate-600">
                    {STATUS_LABELS[bookingStatus] || bookingStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {bookingStatus === "PENDING" && (
                    <>
                      <button type="button" onClick={() => handleBookingAction(request.id, "accept")} className={btnPrimary}>
                        قبول
                      </button>
                      <button type="button" onClick={() => handleBookingAction(request.id, "reject")} className={btnGhost}>
                        رفض
                      </button>
                    </>
                  )}

                  {bookingStatus === "ACCEPTED" && (
                    <button type="button" onClick={() => handleBookingAction(request.id, "complete")} className={btnPrimary}>
                      إنهاء العمل
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm font-bold text-slate-400">
            لا توجد طلبات عمل حالياً.
          </div>
        )}
      </div>
    </div>
  )
}
