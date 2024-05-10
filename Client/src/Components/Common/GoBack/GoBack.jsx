import React from 'react'
import { useNavigate } from 'react-router-dom'

import './GoBack.css'

export default function GoBack() {
    const navigate = useNavigate()
    const goback = () =>{
        navigate(-1)
    }
  return (
    <>
    <button className='gobackbtn' type='submit' onClick={goback}>Back</button>
    </>
  )
}
