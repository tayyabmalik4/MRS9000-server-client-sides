import React from 'react'
// import './Header.css'
import './HeaderLogin.css'
import omni from '../../../Asserts/Logo/Omni.png'
import Logout from '../Logout/Logout'
import { useSelector } from 'react-redux'
import ROLES from '../../../Utils/Roles'



export default function Header(props) {

    const userData = useSelector((state)=>state?.userData)

    return (
        <>
            <div className="machineHeaderLogin">
                <img className='machineimagelogoLogin' src={omni} alt="Uploading" />
                {[ROLES.Admin, ROLES.SuperAdmin].includes(userData?.role) && (
                    <div className="adminName">Admin Panel</div>
                )}
                <div className="machineheadingLogin"><span className='boldmachineheadingLogin'> MRS9000</span> Monitoring & Reporting System</div>
                <div className="headerright">
                <div className="datetimeupdatedLogin">{props.timedate}</div>
                <Logout/>
                </div>
            </div>
        </>
    )
}
