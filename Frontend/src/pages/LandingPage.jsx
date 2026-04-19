import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ServicesCards from "../components/ServicesCards"
import FeaturedWorkers from "../components/FeaturedWorkers"
import HowItWorks from "../components/HowItWorks"
import Testimonials from "../components/Testimonials"
import CtaSection from "../components/CtaSection"
import Footer from "../components/Footer"

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-wrapper min-h-screen">
      <Navbar onLogin={() => navigate("/auth")} />
      <main>
        <Hero />
        <ServicesCards />
        <FeaturedWorkers />
        <HowItWorks />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage