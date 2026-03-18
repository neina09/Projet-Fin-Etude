import { useNavigate } from "react-router-dom"
import Hadreloding from "../compoants/Hadreloding"
import Contant from "../compoants/Contant"
import Footer from "../compoants/Footer"

function Landing() {
  const navigate = useNavigate()
  return (
    <>
      <Hadreloding onLogin={() => navigate("/auth")} />
      <Contant />
      <Footer />
    </>
  )
}

export default Landing