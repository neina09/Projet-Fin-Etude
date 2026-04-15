import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRight,
  CheckCheck,
  MessageCircle,
  Search,
  Send,
  ShieldCheck
} from "lucide-react"
import {
  getChatMessages,
  getMyBookingRequests,
  getMyBookings,
  getMyOffers,
  getMyTasks,
  sendChatMessage
} from "../api"

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-primary",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-fuchsia-500"
]

function getAvatarColor(name) {
  let hash = 0
  for (let index = 0; index < (name || "").length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitial(name) {
  return name?.[0]?.toUpperCase() || "U"
}

export default function ChatSystem({ currentUser }) {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const selectedContactRef = useRef(selectedContact)

  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" })
  }, [])

  useEffect(() => {
    selectedContactRef.current = selectedContact
  }, [selectedContact])

  const fetchContacts = useCallback(async (keepSelectedId = null, showLoader = true) => {
    if (showLoader) setLoadingContacts(true)
    setError("")

    try {
      const [bookingsResult, bookingRequestsResult, myTasksResult, myOffersResult] = await Promise.allSettled([
        getMyBookings(),
        getMyBookingRequests(),
        getMyTasks(),
        getMyOffers()
      ])

      const chatMap = new Map()

      if (bookingsResult.status === "fulfilled") {
        const list = Array.isArray(bookingsResult.value?.content || bookingsResult.value)
          ? bookingsResult.value?.content || bookingsResult.value
          : []

        list.forEach((booking) => {
          if (String(booking.status || "").toUpperCase() === "ACCEPTED" && booking.workerUserId) {
            chatMap.set(booking.workerUserId, {
              id: booking.workerUserId,
              name: booking.workerName,
              role: booking.workerJob || "عامل",
              context: `حجز رقم ${booking.id}`,
              type: "booking"
            })
          }
        })
      }

      if (bookingRequestsResult.status === "fulfilled") {
        const list = Array.isArray(bookingRequestsResult.value?.content || bookingRequestsResult.value)
          ? bookingRequestsResult.value?.content || bookingRequestsResult.value
          : []

        list.forEach((booking) => {
          if (String(booking.status || "").toUpperCase() === "ACCEPTED" && booking.userId) {
            chatMap.set(booking.userId, {
              id: booking.userId,
              name: booking.userName,
              role: "عميل",
              context: `طلب حجز رقم ${booking.id}`,
              type: "booking"
            })
          }
        })
      }

      if (myTasksResult.status === "fulfilled") {
        const list = Array.isArray(myTasksResult.value?.content || myTasksResult.value)
          ? myTasksResult.value?.content || myTasksResult.value
          : []

        list.forEach((task) => {
          if (String(task.status || "").toUpperCase() === "IN_PROGRESS" && task.assignedWorkerUserId) {
            chatMap.set(task.assignedWorkerUserId, {
              id: task.assignedWorkerUserId,
              name: task.assignedWorkerName || "عامل",
              role: "عامل",
              context: `مهمة: ${task.title}`,
              type: "task"
            })
          }
        })
      }

      if (myOffersResult.status === "fulfilled") {
        const list = Array.isArray(myOffersResult.value) ? myOffersResult.value : []

        list.forEach((offer) => {
          if (String(offer.status || "").toUpperCase() === "IN_PROGRESS" && offer.taskUserId) {
            chatMap.set(offer.taskUserId, {
              id: offer.taskUserId,
              name: offer.taskUserName || "صاحب المهمة",
              role: "صاحب المهمة",
              context: `مهمة: ${offer.taskTitle}`,
              type: "task"
            })
          }
        })
      }

      const contactsList = Array.from(chatMap.values())
      const withLastMessage = await Promise.all(
        contactsList.map(async (contact) => {
          try {
            const history = await getChatMessages(contact.id)
            const sorted = Array.isArray(history) ? history : []
            const last = sorted[sorted.length - 1]

            return {
              ...contact,
              lastMessage: last?.content || "",
              lastMessageTime: last?.timestamp || null,
              lastMessageIsMe: last?.senderId === currentUser?.id
            }
          } catch {
            return {
              ...contact,
              lastMessage: "",
              lastMessageTime: null,
              lastMessageIsMe: false
            }
          }
        })
      )

      withLastMessage.sort((left, right) => {
        if (!left.lastMessageTime && !right.lastMessageTime) return 0
        if (!left.lastMessageTime) return 1
        if (!right.lastMessageTime) return -1
        return new Date(right.lastMessageTime) - new Date(left.lastMessageTime)
      })

      setContacts(withLastMessage)

      if (keepSelectedId) {
        const updatedSelection = withLastMessage.find((contact) => contact.id === keepSelectedId)
        if (updatedSelection) {
          setSelectedContact(updatedSelection)
        }
      }
    } catch (err) {
      setError(err.message || "تعذر تحميل جهات الاتصال.")
    } finally {
      if (showLoader) setLoadingContacts(false)
    }
  }, [currentUser?.id])

  const fetchMessages = useCallback(async (userId) => {
    try {
      const data = await getChatMessages(userId)
      const sorted = Array.isArray(data) ? data : []
      setMessages(sorted)

      if (sorted.length > 0) {
        const last = sorted[sorted.length - 1]
        setContacts((current) =>
          current.map((contact) =>
            contact.id === userId
              ? {
                  ...contact,
                  lastMessage: last.content,
                  lastMessageTime: last.timestamp,
                  lastMessageIsMe: last.senderId === currentUser?.id
                }
              : contact
          )
        )
      }

      setTimeout(() => scrollToBottom("smooth"), 60)
    } catch (err) {
      setError(err.message || "تعذر تحميل الرسائل.")
    }
  }, [currentUser?.id, scrollToBottom])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  useEffect(() => {
    const interval = setInterval(() => {
      const current = selectedContactRef.current
      fetchContacts(current?.id ?? null, false)
    }, 2500)

    return () => clearInterval(interval)
  }, [fetchContacts])

  useEffect(() => {
    if (!selectedContact) return

    fetchMessages(selectedContact.id)
    setTimeout(() => scrollToBottom("auto"), 40)

    const interval = setInterval(() => fetchMessages(selectedContact.id), 1500)
    return () => clearInterval(interval)
  }, [fetchMessages, scrollToBottom, selectedContact?.id])

  const handleSend = async (event) => {
    event.preventDefault()
    if (!newMessage.trim() || !selectedContact || sendingMessage) return

    setSendingMessage(true)
    try {
      const sent = await sendChatMessage(selectedContact.id, newMessage.trim())

      setMessages((current) => [...current, sent])
      setNewMessage("")
      setError("")

      setContacts((current) =>
        current
          .map((contact) =>
            contact.id === selectedContact.id
              ? {
                  ...contact,
                  lastMessage: sent.content,
                  lastMessageTime: sent.timestamp,
                  lastMessageIsMe: true
                }
              : contact
          )
          .sort((left, right) => {
            if (!left.lastMessageTime && !right.lastMessageTime) return 0
            if (!left.lastMessageTime) return 1
            if (!right.lastMessageTime) return -1
            return new Date(right.lastMessageTime) - new Date(left.lastMessageTime)
          })
      )

      setTimeout(() => scrollToBottom("smooth"), 50)
      inputRef.current?.focus()
    } catch (err) {
      setError(err.message || "تعذر إرسال الرسالة.")
    } finally {
      setSendingMessage(false)
    }
  }

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => contact.name?.toLowerCase().includes(searchQuery.toLowerCase())),
    [contacts, searchQuery]
  )

  const formatTime = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : ""

  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const today = new Date()

    if (date.toDateString() === today.toDateString()) return "اليوم"

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) return "أمس"

    return date.toLocaleDateString("ar-EG")
  }

  const formatSidebarTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) return formatTime(timestamp)

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) return "أمس"

    return date.toLocaleDateString("ar-EG", { month: "short", day: "numeric" })
  }

  const groupedMessages = useMemo(
    () =>
      messages.reduce((groups, message) => {
        const date = formatDate(message.timestamp)
        if (!groups[date]) groups[date] = []
        groups[date].push(message)
        return groups
      }, {}),
    [messages]
  )

  const selectedSummary = selectedContact
    ? {
        title: selectedContact.type === "task" ? "مسار تنفيذ مهمة" : "محادثة مرتبطة بحجز",
        note:
          selectedContact.type === "task"
            ? "استخدم هذه المساحة لتنسيق خطوات التنفيذ والموعد وأي تحديثات أثناء العمل."
            : "هذه المحادثة مخصصة لتأكيد التفاصيل العملية للزيارة أو الخدمة المحجوزة."
      }
    : null

  return (
    <div className={`grid h-[calc(100vh-160px)] min-h-0 overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-xl transition-all ${selectedContact ? "lg:grid-cols-[300px_minmax(0,1fr)_260px]" : "lg:grid-cols-[300px_minmax(0,1fr)]"}`}>
      <aside className={`${selectedContact ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-e border-surface-100 bg-surface-50`}>
        <div className="border-b border-surface-100 bg-white px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold text-surface-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {contacts.length} نشط
            </div>
            <h2 className="text-base font-black text-surface-900">الرسائل</h2>
          </div>
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-300" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="بحث..."
              className="saas-input h-9 bg-surface-50 pr-8 text-xs"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {loadingContacts ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-surface-400">
              <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-surface-200 border-t-primary" />
              <p className="text-xs font-medium">جاري التحميل...</p>
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="space-y-0.5">
              {filteredContacts.map((contact) => {
                const isActive = selectedContact?.id === contact.id
                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact)
                      setError("")
                    }}
                    className={`w-full rounded-xl p-3 text-right transition-all ${
                      isActive ? "bg-primary/8 shadow-none" : "hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(contact.name)}`}>
                        {getInitial(contact.name)}
                        <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-surface-50 bg-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] text-surface-400">
                            {contact.lastMessageTime ? formatSidebarTime(contact.lastMessageTime) : ""}
                          </span>
                          <h4 className="truncate text-sm font-bold text-surface-900">{contact.name}</h4>
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-1">
                          <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${contact.type === "task" ? "bg-indigo-50 text-indigo-500" : "bg-amber-50 text-amber-600"}`}>
                            {contact.type === "task" ? "مهمة" : "حجز"}
                          </span>
                          <p className="truncate text-[11px] text-surface-400">
                            {contact.lastMessage
                              ? `${contact.lastMessageIsMe ? "أنت: " : ""}${contact.lastMessage}`
                              : contact.context}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <MessageCircle size={28} className="mb-3 text-surface-200" />
              <p className="text-sm font-bold text-surface-600">لا توجد محادثات</p>
              <p className="mt-1 text-xs text-surface-400">تظهر بعد قبول الحجز أو بدء المهمة.</p>
            </div>
          )}
        </div>
      </aside>

      <section className={`${!selectedContact ? "hidden lg:flex" : "flex"} min-h-0 min-w-0 flex-col bg-white`}>
        {selectedContact ? (
          <>
            <div className="border-b border-surface-100 bg-white px-5 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:bg-surface-50 lg:hidden"
                >
                  <ArrowRight size={17} />
                </button>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(selectedContact.name)}`}>
                  {getInitial(selectedContact.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-surface-900">{selectedContact.name}</h3>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-emerald-500">نشط</span>
                  </div>
                  <p className="truncate text-[11px] text-surface-400">{selectedContact.context}</p>
                </div>
                <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ${selectedContact.type === "task" ? "bg-indigo-50 text-indigo-500" : "bg-amber-50 text-amber-600"}`}>
                  {selectedContact.type === "task" ? "مهمة" : "حجز"}
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-dashed border-surface-200 bg-white text-surface-300">
                    <Send size={34} className="rotate-180" />
                  </div>
                  <h4 className="text-lg font-black text-surface-800">ابدأ التنسيق الآن</h4>
                  <p className="mt-2 max-w-sm text-sm font-medium leading-relaxed text-surface-500">
                    أرسل أول رسالة لبدء الاتفاق على الموعد وتفاصيل الخدمة وأي ملاحظات خاصة بالتنفيذ.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedMessages).map(([date, group]) => (
                    <div key={date}>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex-1 border-t border-dashed border-surface-200" />
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-surface-400 shadow-sm">
                          {date}
                        </span>
                        <span className="flex-1 border-t border-dashed border-surface-200" />
                      </div>
                      <div className="space-y-2">
                        {group.map((message, index) => {
                          const isMe = message.senderId === currentUser?.id
                          return (
                            <div
                              key={message.id || index}
                              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${isMe ? "bg-primary" : getAvatarColor(selectedContact.name)}`}>
                                {isMe ? getInitial(currentUser?.username) : getInitial(selectedContact.name)}
                              </div>
                              <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 ${isMe ? "rounded-bl-sm bg-primary text-white" : "rounded-br-sm bg-surface-100 text-surface-800"}`}>
                                <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                                <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMe ? "flex-row-reverse justify-start text-white/60" : "text-surface-400"}`}>
                                  <span>{formatTime(message.timestamp)}</span>
                                  {isMe && <CheckCheck size={11} />}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-surface-100 bg-white px-4 py-3">
              <form onSubmit={handleSend} className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2">
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-40"
                >
                  <Send size={14} className="rotate-180" />
                </button>
                <input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="اكتب رسالة..."
                  className="flex-1 bg-transparent text-sm text-surface-800 placeholder-surface-300 outline-none"
                />
              </form>
            </div>
          </>
        ) : (
          <div className="hidden h-full flex-1 flex-col items-center justify-center px-10 text-center lg:flex">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-50 text-surface-300">
              <MessageCircle size={30} />
            </div>
            <h3 className="text-lg font-bold text-surface-700">اختر محادثة</h3>
            <p className="mt-1 max-w-xs text-sm text-surface-400">
              اختر جهة اتصال من القائمة لبدء التواصل.
            </p>
          </div>
        )}
      </section>

      {selectedContact && (
        <aside className="hidden min-h-0 border-s border-surface-100 bg-surface-50 p-4 lg:flex lg:flex-col">
          <div className="rounded-xl border border-surface-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(selectedContact.name)}`}>
                {getInitial(selectedContact.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-surface-900">{selectedContact.name}</h4>
                <p className="text-[11px] text-surface-400">{selectedContact.role}</p>
              </div>
            </div>
            <p className="rounded-lg bg-surface-50 px-3 py-2.5 text-[11px] leading-relaxed text-surface-500">
              {selectedSummary?.note}
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-surface-200 bg-white p-4">
            <h5 className="mb-3 text-xs font-bold text-surface-700">تفاصيل</h5>
            <div className="space-y-2">
              {[
                { label: "الارتباط", value: selectedContact.context },
                { label: "آخر تحديث", value: selectedContact.lastMessageTime ? formatSidebarTime(selectedContact.lastMessageTime) : "—" },
                { label: "الرسائل", value: messages.length }
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-surface-50 px-3 py-2">
                  <span className="text-[11px] font-medium text-surface-400">{label}</span>
                  <span className="text-[11px] font-bold text-surface-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={13} className="text-primary" />
              <span className="text-[10px] font-bold text-primary">نصائح</span>
            </div>
            <ul className="space-y-1.5 text-[11px] leading-relaxed text-surface-600">
              <li>أكد الموعد والمكان بوضوح.</li>
              <li>أرسل التحديثات أثناء التنفيذ.</li>
              <li>احتفظ بالملاحظات في نفس المسار.</li>
            </ul>
          </div>
        </aside>
      )}
    </div>
  )
}
