import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function Protected({children}) {
    const {user} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    useEffect(() => {
      if(!user){
        navigate('/login');
      }
    }, [])
    
  return <>{children}</>
}

export default Protected