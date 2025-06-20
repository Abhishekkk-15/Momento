import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

export default function Comment({comment}) {
  return (
    <div className=' my-2'>
        <div className='flex items-center'>
            <Avatar>
                <AvatarImage className='h-8 w-8 rounded-full' src={comment?.author?.profilePicture}/>
                <AvatarFallback className="bg-black text-white rounded-full h-8 w-8 flex items-center p-1">CN</AvatarFallback>
            </Avatar>
            <h1 className=' pl-2 font-bold text-sm'>{comment?.author?.username} :  <span className='font-normal pl-1'>{comment?.text}</span></h1>
        </div>
    </div>
  )
}
