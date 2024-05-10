import React from 'react'
import GoBack from '../GoBack/GoBack'
import Logout from '../Logout/Logout'
import './Footer.css'
import hunch from '../../../Asserts/Logo/hunch.png'

export default function Footer(props) {
  return (
   <>
   <div className="footer"> 
                <div className="btns">
                    <GoBack />
                    <Logout />
                </div>
                <div className="develop">
                    <div className="develophead">{props.comp}</div>
                    <img className='hunchlogo' src={hunch} alt="Uploading" />
                </div>

            </div>
   </>
  )
}
