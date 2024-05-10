import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { LoginAPI } from "../../../Service/AuthApi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import ROLES from "../../../Utils/Roles";

// Redux
import { userDataActions } from "../../../Redux/Slice/userData";
import { Input } from "antd";

// Asserts
import omni from "../../../Asserts/Logo/Omni.png";
import advertise from "../../../Asserts/Imgs/advertise.jpg";

export default function Login() {
  const Dispatch = new useDispatch();

  const defaultvalue = {
    email: "",
    password: "",
  };
  const [loading, setloading] = useState(false);
  const [userlogin, setuserlogin] = useState(defaultvalue);

  const navigate = useNavigate();

  const onvaluechange = (e) => {
    setuserlogin({ ...userlogin, [e.target.name]: e.target.value });
  };
  const userData = useSelector((state) => state?.userData);
  const handleLogin = async () => {
    setloading(true);
    let res = await LoginAPI({
      email: userlogin.email,
      password: userlogin.password,
    });
    if (res.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res.data.message);
      Dispatch(userDataActions.setUserData(res?.data?.result));
      let token = res?.data?.result?.token;
      localStorage.setItem("UserToken", token);
      localStorage.setItem("UserData", JSON.stringify(res?.data?.result));
      setTimeout(() => {
        if ([ROLES.Admin, ROLES.SuperAdmin].includes(userData?.role)) {
          navigate(`/building`);
        } else {
          navigate(`/building`);
        }
        // window.location.href = "/"
      }, 500);
    }
    setloading(false);
  };

  // const loginClick = async () => {
  //   let response = await login(userlogin);
  //   if (response.data[0]?.admin) {
  //     toast.success("Admin Login Success", {
  //       position: "top-right",
  //       autoClose: 500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     setTimeout(() => {
  //       navigate("/building");
  //     }, 1000);
  //   } else if (response.data[0]?.admin === false) {
  //     toast.success("User Login Success", {
  //       position: "top-right",
  //       autoClose: 500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     setTimeout(() => {
  //       navigate(`/building`);
  //       // navigate(`/dashboard/Dep?MQTT_ID=m1`)
  //     }, 1000);
  //   } else {
  //     toast.error("Invalid Cridentials", {
  //       position: "top-right",
  //       autoClose: 500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  //   localStorage.setItem("login", JSON.stringify(response.data));
  // };

  return (
    <>
      <div className="loginmainContainer">
        <img src={omni} alt="Uploading" className="logoImage" />
        <div className="logincontainer">
          <div className="loginform">
            <div className="headinglogin">Login</div>
            <Input
              className="logininput"
              onChange={(e) => onvaluechange(e)}
              type="text"
              name="email"
              id="username"
              placeholder="Username"
            />
            <Input.Password
              className="logininput"
              onChange={(e) => onvaluechange(e)}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
            <button className="EditBtn" type="submit" onClick={handleLogin}>
              {" "}
              Login{" "}
            </button>
          </div>
        </div>
        <div className="logincontent">
          <div className="loginContentHead">
            <img className="omniImage" src={omni} alt="Uploading" />
            <div className="loginContentHeading">
              <h3>MRS9000</h3>
              <br />
              Monitoring & Reporting System
            </div>
          </div>
          <div className="loginContentPara">
            Our vision is to automate industries to get optimum performence
            using:
            <ul type="i">
              <li>* Online Monitoring & Reporting System using Amazon (AWS)</li>
              <li>* Programmable Logic Controllers (PLCs)</li>
              <li>* Embedded SCB & field instruments</li>
              <li>* Intrigration with existing SCADA</li>
              <li>* Internet of Things (IoT)</li>
            </ul>
            <div className="paraContent">
              Industrial automation uses software based AI technology to
              imporove machines processes which in performing specific
              functions and quality control. The initial goals of
              industrial automation has to focused on increasing productivity by
              extending work hours, and reducing the costs of ownership.
            </div>
          </div>
          <img className="adertise" src={advertise} alt="" />
        </div>
      </div>
    </>
  );
}
