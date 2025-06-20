import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/Hooks/useGetAllPost'
import useSuggestedUsers from '@/Hooks/useSuggestedUsers'
import StorySection from './StorySection'


export default function Home() {
  useGetAllPost();
  useSuggestedUsers();
  return (
     <div className='flex relative w-full'>
      <div className='flex flex-col flex-grow w-full max-w-[600px] mx-auto'>
        {/* Show StorySection above Feed */}
        <StorySection />
        <Feed />
        <Outlet />
      </div>

      {/* Fixed Right Sidebar */}
      <div className='hidden lg:block fixed right-4 top-4 w-[300px]'>
        <RightSidebar />
      </div>
    </div>
  )
}
