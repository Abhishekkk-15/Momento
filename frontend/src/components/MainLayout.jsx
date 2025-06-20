import React from 'react'
import { Outlet } from 'react-router-dom'
 import Leftsidebar from './Leftsidebar'
import Bottomsidebar from './Bottomsidebar'

export default function MainLayout() {
  return (
    <div>
      <Leftsidebar/>  
      <div>
        <Outlet/>
      </div>
      <Bottomsidebar/>
    </div>
  )
}
