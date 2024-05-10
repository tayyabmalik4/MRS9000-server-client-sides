import './App.css';

import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

// Helpers 
import Clock from "react-live-clock";

// import MachineData from './Components/MachineData/MachineData';
import Login from './Components/Auth/Login/Login';
import ProtedtedRoute from './Components/GlobalRoute/ProtedtedRoute';
import Building from './Components/Building/Building'
import AddBuilding from './Components/Building/AddBuilding/AddBuilding'
import Department from './Components/Department/Department'
import AddDepartment from './Components/Department/AddDepartment/AddDepartment'
import Machine from './Components/Machine/Machine';
import AddMachine from './Components/Machine/AddMachine/AddMachine'
import Device from './Components/Device/Device';
import AddDevice from './Components/Device/AddDevice/AddDevice'
import MainDashboard from './Components/MainDashboard/MainDashboard'
import ReportMachine from './Components/ReportMachine/ReportMachine';
import ReportMachineHour from './Components/ReportMachineHour/ReportMachineHour';
import Error from './Components/PageNotFound/PageError';
import Footer from './Components/Common/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import Header from './Components/Common/Header/HeaderLogin';

const ProtectedRoutes = () => {
  let location = useLocation()
  
  return (
    <>
      <div className="App">
        {location.pathname !== "/login" && <Header timedate={
              <Clock
                format={"HH:mm:ss| DD-MM-YYYY"}
                ticking={true}
                timezone={"asia/Karachi"}
              />
            }/>
          }
        <Routes>
          <Route exact path='/login' element={<Login />}></Route>
          <Route exact path='/' element={<Navigate replace to='/login' />}></Route>
          <Route exact path='/building' element={<ProtedtedRoute Component={Building } />}></Route>
          <Route exact path='/building/add' element={<ProtedtedRoute Component={AddBuilding } />}></Route>
          <Route exact path='/department' element={<ProtedtedRoute Component={Department } />}></Route>
          <Route exact path='/department/add' element={<ProtedtedRoute Component={AddDepartment } />}></Route>
          <Route exact path='/machine' element={<ProtedtedRoute Component={Machine } />}></Route>
          <Route exact path='machine/add' element={<ProtedtedRoute Component={AddMachine } />}></Route>
          <Route exact path='/device' element={<ProtedtedRoute Component={Device } />}></Route>
          <Route exact path='device/add' element={<ProtedtedRoute Component={AddDevice } />}></Route>
          {/* <Route exact path='/dashboard' element={<ProtedtedRoute Component={Machine } />}></Route> */}
          {/* <Route exact path='/dashboard/Dep' element={<ProtedtedRoute Component={MachineData} />}></Route> */}
          <Route exact path='/dev' element={<ProtedtedRoute Component={MainDashboard} />}></Route>
          <Route exact path='/dev/report' element={<ProtedtedRoute Component={ReportMachine} />}></Route>
          <Route exact path='/dev/reportHour' element={<ProtedtedRoute Component={ReportMachineHour} />}></Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      {/* {location.pathname !== "/login" && location.pathname !== "/building"&& location.pathname !== "/dashboard" && location.pathname !== "/dashboard/report" && <Footer comp={"Developed & Designed by HUNCH Automation Private Limited"} />} */}
    </>
  )
}

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      // theme="dark"
      />
      <Router>
        <ProtectedRoutes />
      </Router>
    </>
  );
}

export default App;
