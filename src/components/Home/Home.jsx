import React from 'react'
import Hero from './Hero'
import HomeServices from './HomeServices'
import Form from '../Form'

const Home = () => {
  return (
    <div className='home-content'>
        <Hero/>
        <HomeServices/>
        <Form/>
    </div>
  )
}

export default Home