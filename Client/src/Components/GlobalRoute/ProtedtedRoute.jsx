import React , {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProtedtedRoute(props) {
    const {Component} = props;
    const navigate = useNavigate();
    useEffect (()=>{
        let token = localStorage.getItem('UserToken')? localStorage.getItem('UserToken') : null
        if(!token){
            navigate('/login')
        }
    })
    // let token = localStorage.getItem("UserToken")
    // let AuthToken = token ?? null
  
  return (
    <>
    <Component />
    </>
  )
}
