import heroImg from '../assets/Imagen-esfera-hexagono.png';

import Button from './Button';

import './Hero.css';

function Hero() {
  return (
    <section className='hero-section'>
      <img className='hero-img' src={heroImg} alt="" />
      <p className='hero-p'>BUILDING TAILORED SOFTWARE SOLUTIONS</p>
      <h1 className='hero-h1'>Making technology <span>boost</span> your business.</h1>
      <Button name='ABOUT US' classStyle='hero-btn' />
      <a className='hero-godown'>GO DOWN TO EXPLORE</a>
      <svg className='icon-godown' viewBox="0 0 19 8" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 0.999999L8.92332 6.59293C9.26904 6.83697 9.73096 6.83697 10.0767 6.59293L18 1" stroke="#7874F4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </section>
  );
}

export default Hero;