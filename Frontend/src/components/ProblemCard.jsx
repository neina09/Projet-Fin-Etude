import React, { useState } from "react"


function ProblemCard({ problem = {} }) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState(problem?.comments || [])
  const [text, setText] = useState("")

  const addComment = () => {
    if (!text.trim()) return

    setComments([
      ...comments,
      {
        id: Date.now(),
        author: "You",
        text
      }
    ])

    setText("")
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-blue-500/40 transition">

      {/* Header */}
      <div className="flex gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-lg">
          {problem.authorEmoji || "👤"}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {problem.author || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            {problem.time || ""}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-white mb-2">
        {problem.title || "No title"}
      </h3>

      {/* Body */}
      <p className="text-sm text-gray-400 mb-3">
        {problem.body || ""}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {problem.tags?.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Toggle comments */}
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        💬 {comments.length} comments
      </button>

      {/* Comments */}
      {open && (
        <div className="mt-4 border-t border-gray-700 pt-3">

          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-800 p-2 rounded-lg text-sm">
                <b className="text-white">{c.author}</b>
                <p className="text-gray-300">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <div className="flex gap-2 mt-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write comment..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
            <button
              onClick={addComment}
              className="bg-blue-600 px-3 py-2 rounded-lg text-xs text-white hover:bg-blue-700"
            >
              Send
            </button>
          </div>

        </div>
      )}

    </div>
  )
}

export default ProblemCard