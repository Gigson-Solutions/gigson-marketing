import homeServicesImg from '../../assets/FormasServices.png'
import './HomeServices.css'
import {Link} from 'react-router-dom'

function HomeServices() {
  return (
    <section className='home-services' id='homeServices'>
        <div className="home-services-bg"></div>
        <div className="home-text-container">
          <div className="services-h2-animation">
            <h2 className='home-services-h2'>Tailored <span>solutions</span> for any business ·</h2>
          </div>
          <div className="services-h2-animation">
            <h2 className='home-services-h2'>Tailored <span>solutions</span> for any business ·</h2>
          </div>
          <div className="services-h2-animation">
            <h2 className='home-services-h2'>Tailored <span>solutions</span> for any business ·</h2>
          </div>
          <div className="services-h2-animation">
            <h2 className='home-services-h2'>Tailored <span>solutions</span> for any business ·</h2>
          </div>  
        </div>
        <div className="home-services-info">
          <img className='home-services-img' src={homeServicesImg} />
          <div className="home-services-text">
            <p className='home-services-p'>We are focused to leverage the technology to  your business, connecting and making it secure to align needs and business goals.</p>
            <p className='home-services-p'>And if your solution does not exist yet, let's build it together.</p>

            <Link to='/services' className='home-services-btn  button-main'>DISCOVER OUR SERVICES</Link>
          </div>
        </div>
    </section>
  )
}

export default HomeServices