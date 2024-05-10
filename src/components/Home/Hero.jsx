import './Hero.css'
import '../Button.css'
import heroImg from '../../assets/Imagen-esfera-hexagono.webp'
import {Link} from 'react-router-dom'

function Hero() {
  return (
    <section className='hero-section'>
      <header className="hero-top-content">
        <img className='hero-img' src={heroImg} alt="" />
        <div className="hero-text">
          <p className='hero-p'>BUILDING TAILORED SOFTWARE SOLUTIONS</p>
          <h1 className='hero-h1'>Making technology <span>boost</span> your business<span>.</span></h1>
          <Link to='/about' className='hero-btn button-main'>ABOUT US</Link>
      </div>
      </header>
      <footer className="hero-godown">
        <a href='#homeServices' className='hero-godown-a'>GO DOWN TO EXPLORE</a>
        <svg className='icon-godown' viewBox="0 0 19 8" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 0.999999L8.92332 6.59293C9.26904 6.83697 9.73096 6.83697 10.0767 6.59293L18 1" stroke='#7874f4'/>
        </svg>
      </footer>
    </section>
  )
}

export default Hero