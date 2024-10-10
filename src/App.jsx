import "./App.css";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutHero from "./components/AboutHero";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
   return (
      <>
         <Router>
            <Navbar />
            <Routes>
               <Route exact path="/" element={<Home />} />
               <Route exact path="/about" element={<AboutHero />} />
            </Routes>
            <Footer />
         </Router>
      </>
   );
}

export default App;
