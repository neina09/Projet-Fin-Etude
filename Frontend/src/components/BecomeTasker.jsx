import React from "react"

function BecomeTasker() {
  return (
    <section className="py-24 px-6 relative bg-gradient-to-br from-[#004384] via-[#003366] to-[#001f3f] text-white">

      {/* Glow background — dans un wrapper séparé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFB909]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Become a Tasker & Start Earning 💼
          </h2>
          <p className="text-gray-200 mb-6 max-w-md">
            Join our platform and connect with people who need your skills.
            Work on your own schedule and grow your income بسهولة.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              "Flexible working hours",
              "Find jobs بسهولة",
              "Build your reputation ⭐",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#FFB909]">✔</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Button */}
          <button className="bg-[#FFB909] text-[#004384] font-semibold px-6 py-3 rounded-xl 
          hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl
          hover:scale-105 active:scale-95">
            Become a Tasker
          </button>
        </div>

        {/* Right */}
        <div className="relative group">
          <img
            src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80"
            alt="worker"
            className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
          />
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#FFB909]/30 blur-3xl rounded-full"></div>
        </div>

      </div>
    </section>
  )
}

export default BecomeTasker