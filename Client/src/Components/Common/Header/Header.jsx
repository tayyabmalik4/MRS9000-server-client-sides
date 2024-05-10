import React from 'react'
import './Header.css'
import Omni from '../../../Asserts/Logo/Omni.png'
// import { useLocation } from 'react-router-dom'

export default function Header(props) {
    // const location = useLocation()
    // let roomName = location?.state?.roomName
    // console.log("123",roomName)
    return (
        <>
            <div className="machineHeader">
                <img className='machineimagelogo' src={Omni} alt="Uploading" />
                <div className="roomName">{props.roomName}</div>
                <div className="machineheading"><strong className='boldmachineheading'> MRS9000</strong> MONITORING WITH REPORTING</div>
                <div className="datetimeupdated">{props.timedate}</div>
                
            </div>
        </>
    )
}
