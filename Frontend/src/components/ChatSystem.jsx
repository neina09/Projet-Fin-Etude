import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, MessageCircle, Clock, ChevronRight, Hash } from "lucide-react";
import { getChatHistory, sendChatMessage, getMyBookings, getMyTasks, getMyOffers } from "../api";

export default function ChatSystem({ currentUser }) {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(() => {
      if (selectedContact) fetchMessages(selectedContact.id);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      const bookings = await getMyBookings();
      const myOffers = await getMyOffers();
      
      const chatableUsers = new Map();

      // From Bookings (as User)
      bookings.forEach(b => {
        if (b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED') {
          chatableUsers.set(b.worker.user.id, {
            id: b.worker.user.id,
            name: b.worker.name,
            role: 'Worker',
            context: 'Booking #' + b.id
          });
        }
      });

      // From My Offers (as Worker)
      myOffers.forEach(o => {
        if (o.task && (o.status === 'IN_PROGRESS' || o.status === 'COMPLETED')) {
           chatableUsers.set(o.task.userId, {
             id: o.task.userId,
             name: o.task.userName,
             role: 'Client',
             context: 'Task: ' + o.task.title
           });
        }
      });

      setContacts(Array.from(chatableUsers.values()));
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const data = await getChatHistory(userId);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    try {
      const sent = await sendChatMessage(selectedContact.id, newMessage);
      setMessages([...messages, sent]);
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      alert("فشل إرسال الرسالة: " + err.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
      
      {/* ── Contacts Sidebar ── */}
      <div className="w-80 border-s border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">المحادثات</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">لديك {contacts.length} جهة اتصال نشطة</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {contacts.length > 0 ? (
            contacts.map(c => (
              <button 
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all ${selectedContact?.id === c.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 -translate-x-1' : 'hover:bg-white text-slate-600'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${selectedContact?.id === c.id ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  {c.name[0].toUpperCase()}
                </div>
                <div className="flex-1 text-end">
                  <h4 className="text-sm font-black truncate">{c.name}</h4>
                  <p className={`text-[10px] font-bold opacity-60 uppercase tracking-tighter`}>{c.role}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <MessageCircle size={40} className="mb-4" />
              <p className="text-xs font-black">لا توجد محادثات نشطة بعد. اطلب خدمة أولاً.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Message Window ── */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl border border-blue-100">
                  {selectedContact.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 font-bold text-[9px] text-emerald-500 uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     نشط الآن
                  </div>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                 {selectedContact.context}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((m, idx) => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div key={m.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[70%] p-5 rounded-[2.5rem] ${isMe ? 'bg-blue-600 text-white rounded-be- shadow-xl shadow-blue-100' : 'bg-slate-50 text-slate-700 rounded-bs-'}`}>
                      <p className="text-sm font-bold leading-relaxed">{m.content}</p>
                      <div className={`flex items-center gap-1.5 mt-2 font-black text-[9px] uppercase tracking-widest ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                        <Clock size={10} />
                        {new Date(m.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-4 p-2 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 focus-within:border-blue-500 transition-all">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-transparent px-6 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:grayscale"
                >
                  <Send size={24} className="rotate-180" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
            <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center text-slate-200 mb-8 border-4 border-dashed border-slate-100">
              <MessageCircle size={64} />
            </div>
            <h3 className="text-2xl font-black text-slate-400">ابدأ المحادثة</h3>
            <p className="text-sm font-bold text-slate-300 mt-4 max-w-xs">اختر جهة اتصال من القائمة اليمنى لبدء المراسلة الفورية.</p>
          </div>
        )}
      </div>
    </div>
  );
}
