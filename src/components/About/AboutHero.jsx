import './AboutHero.css'
import cubeSvg from '../../assets/cubo-about.svg'
import piraSvg from '../../assets/Piramide-about.svg'
import circSvg from '../../assets/circulo-about.svg'
import triaSvg from '../../assets/Trianguloycirculo.svg'
import {Link} from 'react-router-dom'


const AboutHero = () => {
  return (
    <>
        <section className='div-about-hero'>
            <div className="about-bg"></div>
            <h1 className='about-hero-h1'>Our team is built by professionals with more than <span className='about-span-hero'>9 years</span> of experience.</h1>
            <p className='about-hero-p'>We have the required profiles to face the end-to-end digital product development to offer an all-in-one service.</p>
            <Link to='/contact' className='about-hero-btn button-main'>LET'S TALK</Link>    
        </section>
        <div className="about-belive-max">
            <h2 className='about-hero-h2'>What be believe</h2>
            <section className='div-about-belive'>
                <article>
                    <div className='div-svg-about'>
                        <img src={cubeSvg} alt="Cube" />
                    </div>
                    <span className='about-span'>01</span>
                    
                    <h3 className='about-h3'>Quality</h3>
                    <p className='about-believe-p'>Regardless of whether we're crafting a proof of concept or a final product, we apply various product quality and project management standards to ensure that every product meets and exceeds expectations.</p>
                </article>
                <article>
                    <div className='div-svg-about'>
                        <img src={piraSvg} alt="Pira" />
                    </div>

                    <span className='about-span'>02</span>
                    <h3 className='about-h3'>Commitment</h3>
                    <p className='about-believe-p'>You'll have the flexibility to choose the level of engagement you prefer with us. We'll always be by your side to support you at any stage, but if you decide not to continue, we'll handle the closure and necessary handover, complying with all current legal requirements.</p>
                </article>
                
                <article>
                    <div className='div-svg-about'>
                        <img className='svg-about-circ' src={circSvg} alt="Circ" />
                    </div>
                    <span className='about-span'>03</span>
                    <h3 className='about-h3'>Security</h3>
                    <p className='about-believe-p'>Security is essential to us. We offer the ability to audit and certify our cloud solutions with CIS, CISA, FedRAMP, PCI-DSS, GDPR, FFIEC, and SOC2.</p>
                </article>
            </section>
        </div>
        <section className='about-section-need'>
            <img className='about-background-image-DgPrd' src={triaSvg} alt="tria" /> {}
            <h2 className='about-hero-need-h2'>What do I need to build a <span className='about-span-hero'>Digital product</span>?</h2>
            <p className='about-need-p'>Develop a software product is much more than just building physical product or running a project. This type of products require full attention and knowledge in different areas to avoid  costs overrun or technology limitations.</p>
            <div className='about-div-specialist'>
                <div>
                    <h3 className='about-need-h3'>Product Manager</h3>
                    <p className='about-need-p1'>WHO MANAGE THE PRODUCT</p>
                </div>
                
                <div>
                    <h3 className='about-need-h3'>FullStack</h3>
                    <p  className='about-need-p1'>WHO CODES ALMOST EVERYTHING</p>
                </div>
                <div>
                    <h3 className='about-need-h3'>BackEnd Developer</h3>
                    <p className='about-need-p1'>WHO CODES HOW THE PRODUCT WORKS</p>
                </div>
                <div>
                    <h3 className='about-need-h3'>Business Analyst</h3>
                    <p className='about-need-p1'>WHO THINKS ABOUT THE BUSINESS</p>
                </div>
                <div>
                    <h3 className='about-need-h3'>Quality Assurance</h3>
                    <p className='about-need-p1'>WHO VALIDATES</p>
                </div>
                <div>
                    <h3 className='about-need-h3'>UX/UI Designer</h3>
                    <p className='about-need-p1'>WHO DESIGN WHAT YOU FEEL</p>
                </div>
                <div>
                    <h3 className='about-need-h3'>Solution Architect</h3>
                    <p className='about-need-p1'>Technical Lead</p>
                </div>
                <div>
                    <h3 className='about-need-h3'>Frontend Developer</h3>
                    <p className='about-need-p1'>Visible Code Picker</p>
                </div>
            </div>
            <p className='about-believe-p'>*Not all of these roles are necessary in all products. Wisely selection is needed depending on needs and sectors.</p>
            <div className="about-button-container">
                <Link to='/contact' className='about-button-contact button-main'>CONTACT US</Link> 
            </div>
        </section>        
    </>
  )
}

export default AboutHero