import React from "react";
import { Bell, Check, Clock, Info, MessageSquare, Briefcase, UserCheck } from "lucide-react";

export default function NotificationList({ notifications, onMarkAsRead, onClose }) {
  const icoSize = 16;
  
  const typeConfig = {
    TASK_OFFER:    { icon: <MessageSquare size={icoSize} />, color: "text-blue-600", bg: "bg-blue-50" },
    TASK_SELECTED: { icon: <UserCheck size={icoSize} />,     color: "text-emerald-600", bg: "bg-emerald-50" },
    TASK_ACCEPTED: { icon: <Briefcase size={icoSize} />,     color: "text-amber-600", bg: "bg-amber-50" },
    DEFAULT:       { icon: <Info size={icoSize} />,          color: "text-slate-600", bg: "bg-slate-50" }
  };

  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "الآن";
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="absolute top-12 start- w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[200] animate-in slide-in-from-top-2 duration-300">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Bell size={16} className="text-blue-600" />
          الإشعارات
        </h3>
        {notifications.some(n => !n.isRead) && (
           <span className="bg-rose-500 w-2 h-2 rounded-full animate-pulse" />
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100">
        {notifications.length > 0 ? (
          notifications.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.DEFAULT;
            return (
              <div 
                key={n.id} 
                className={`p-4 border-b border-slate-50 flex gap-4 transition-all hover:bg-slate-50 relative group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                onClick={() => !n.isRead && onMarkAsRead(n.id)}
              >
                <div className={`w-10 h-10 rounded-2xl ${cfg.bg} ${cfg.color} flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0 text-end">
                  <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 font-bold text-[9px] text-slate-400 uppercase tracking-widest">
                    <Clock size={10} />
                    {getRelativeTime(n.createdAt)}
                  </div>
                </div>
                {!n.isRead && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onMarkAsRead(n.id); }}
                    className="absolute start- top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50 opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-50"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 px-6 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-4">
                <Bell size={32} />
             </div>
             <p className="text-sm font-black text-slate-300">لا توجد إشعارات حالياً</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50/50 text-center">
         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
            عرض كل الإشعارات
         </button>
      </div>
    </div>
  );
}
