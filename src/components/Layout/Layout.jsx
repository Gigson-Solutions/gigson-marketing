import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react';

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0,0)
  }, [pathname])

  return (
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
  )
}

export default Layout