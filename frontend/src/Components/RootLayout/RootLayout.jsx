import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import Footer from '../Footer/Footer'
import './RootLayout.css'

function RootLayout() {
  return (
    <div className='root'>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout