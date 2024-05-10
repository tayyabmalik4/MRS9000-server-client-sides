import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Logout.scss'

export default function Logout() {
    const navigate = useNavigate()

    const logout = () =>{
        localStorage.clear()
        navigate('/login')
    }
  return (
    <>
    <div className="LogOutMain">
    <button className='EditBtn' type='submit' onClick={logout}>Logout</button>
    </div>
    </>
  )
}
