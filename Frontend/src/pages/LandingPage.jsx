import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ServicesCards from "../components/ServicesCards"
import FeaturedWorkers from "../components/FeaturedWorkers"
import HowItWorks from "../components/HowItWorks"
import BecomeTasker from "../components/BecomeTasker"
import AboutUs from "../components/AboutUs"
import Footer from "../components/Footer"
import Testimonials from "../components/Testimonials"


function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar onLogin={() => navigate("/auth")} />
      <Hero />
      <ServicesCards />
      <FeaturedWorkers />
      <HowItWorks />
      <BecomeTasker />
      <AboutUs />
      <Testimonials />
      <Footer />
    </>
  )
}

export default LandingPage