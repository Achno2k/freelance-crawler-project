import HeroSection from "./Components/HeroSection"
import AboutUs from "./Components/About"
import Services from "./Components/Services"
import Projects from "./Components/Projects"
import Contact from "./Components/Contact"
import Header from "./Components/Header"
import Footer from "./Components/Footer"

export default function App() {
  return <>
    <div className="font-poppins">
        <Header/>
        <HeroSection/>
        <AboutUs/>
        <Services/>
        <Projects/>
        <Contact/>
        <Footer/>
    </div>
  </>
}