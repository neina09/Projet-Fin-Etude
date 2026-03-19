import React from "react"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-[#001f3f] text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Chghloni
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connecting people with skilled local workers — fast, simple, and reliable.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            <Facebook className="hover:text-[#FFB909] cursor-pointer" />
            <Twitter className="hover:text-[#FFB909] cursor-pointer" />
            <Instagram className="hover:text-[#FFB909] cursor-pointer" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#FFB909] cursor-pointer">About Us</li>
            <li className="hover:text-[#FFB909] cursor-pointer">Careers</li>
            <li className="hover:text-[#FFB909] cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#FFB909] cursor-pointer">Find Workers</li>
            <li className="hover:text-[#FFB909] cursor-pointer">Become a Tasker</li>
            <li className="hover:text-[#FFB909] cursor-pointer">How It Works</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={16} />
            <span>support@chghloni.com</span>
          </div>

          {/* Newsletter */}
          <div className="mt-4">
            <p className="text-sm mb-2">Subscribe to our newsletter</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-l-lg bg-white/10 text-white text-sm outline-none"
              />
              <button className="bg-[#FFB909] text-[#004384] px-4 rounded-r-lg text-sm font-semibold hover:bg-yellow-400">
                Join
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Chghloni. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer