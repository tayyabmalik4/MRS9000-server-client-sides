import { DateRangePicker } from "rsuite";
import React, { useState, useEffect } from "react";
import "./MainDashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import Header from "../Common/Header/Header";
import Clock from "react-live-clock";
import { GetMeterData } from "../../Service/MeterApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActiveStatus from "./ActiveStatus/ActiveStatus";
import LinearProgress from "@mui/material/LinearProgress";
import { BsArrowLeftShort } from "react-icons/bs";

export default function MainDashboard() {
  const [value, setValue] = useState([]);

  let new1 = moment(value[0])?.format("DD-MM-YYYY");
  let new2 = moment(value[1])?.format("DD-MM-YYYY");

  let sdate = moment(value[0])?.format("YYYY-MM-DD");
  let edate = moment(value[1])?.format("YYYY-MM-DD");

  let sendDate = {
    startDate: new1,
    endDate: new2,
  };
  let dateback = {
    startDate: sdate,
    endDate: edate,
  };
  const settingDate = (event) => {
    if (event == null) {
      setValue([]);
    } else {
      setValue(event);
    }
  };
  const navigate = useNavigate();
  const location = useLocation();

  let MQTT_ID = new URLSearchParams(location.search).get("MQTT_ID");
  const [meterDashData, setMeterDashData] = useState([]);
  const [loading, setLoading] = useState(false);
  // this api is goes to get api of meters data
  const gettingMeterData = async () => {
    setLoading(true);
    let payload = {
      MQTT_ID: MQTT_ID,
    };
    let res = await GetMeterData(payload);
    if (res.error != null) {
      toast.error(res.error);
    } else {
      setMeterDashData(res.data?.result);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (MQTT_ID) {
      // setInterval(() => {
      gettingMeterData();
      // }, 5000);
    }
  }, [MQTT_ID]);
  let machineName = meterDashData?.title;
  let getarray = meterDashData?.meterReadings;
  let getarrayHour = meterDashData?.HourReadings;
  let getarrayDay = meterDashData?.DayReadings;
  // let getarray = meterDashData?.map((array) => {
  //     return array?.meterReadings;
  //   });
  //   let getarrayHour = meterDashData?.map((array) => {
  //       return array?.HourReadings;
  //     });
  // Month Average Calculation

  let currentMonth = getarrayHour?.slice(-1)[0]?.datetimeMonth;
  // console.log("7495394",getarrayHour[getarrayHour?.length - 1])

  let result = [];
  if (getarrayDay) {
    getarrayDay?.filter((val) => {
      let currentData = val?.datetimeMonth;
      if (currentData == currentMonth) {
        result.push(val);
      } else {
        return false;
      }
    });
  }
  // let CurrentMonthDateFilter = meterDashData?.map((meter) => {
  //   return {
  //     ...meter,
  //     meterReadings: meter?.DayReadings.filter((val) => {
  //       let currenDate = val?.datetimeMonth;
  //       if (currenDate === currentMonth) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //   };
  // });
  // let readd = CurrentMonthDateFilter[0]?.meterReadings;
  let readd = result;
  let daylength = readd?.length;
  let totalthismonth = 0;
  if (readd) {
    totalthismonth = readd?.slice(-1)[0]?.total - readd?.[0]?.total;
  }
  let AvgtotalMonth = totalthismonth / daylength;

  // the function is use to find the date between start date and last date
  const findByDateDaily = () => {
    let startDate = dateback?.startDate;
    let endDate = dateback?.endDate;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let epStartDate = new Date(sDate - 18000000).getTime();
    let epEndDate = new Date(eDate + 69000000).getTime();

    let result = [];
    if (getarrayDay) {
      getarrayDay.filter((val) => {
        let currenDate = new Date(val?.datetime).getTime();
        if (currenDate >= epStartDate && currenDate <= epEndDate) {
          result.push(val);
        } else {
          return false;
        }
      });
    }
    console.log("this is result", result);
    navigate("/dev/report", {
      state: {
        date: sendDate,
        roomName: machineName,
        filterDate: result,
        getarrayHour: getarrayHour,
      },
    });
  };
  // let filterDate = meterDashData?.map((meter) => {
  //   return {
  //     ...meter,
  //     meterReadings: meter?.DayReadings.filter((val) => {
  //       let currenDate = new Date(val?.datetime).getTime();
  //       if (currenDate >= epStartDate && currenDate <= epEndDate) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //   };
  // });

  return (
    <>
      {loading === true ? (
        <div className="loader">
          <LinearProgress />
        </div>
      ) : (
        <>
          <div className="MainDashboardContainer">
            <div className="headleft">
              <BsArrowLeftShort
                className="icon cursor"
                onClick={() => navigate(-1)}
              />
              <div className="heading">
                {meterDashData?.title}{" "}
                <span className="deviceID">({meterDashData?.Device_ID})</span>
              </div>
            </div>
            <ActiveStatus
              // roomName={machineName}
              // deviceID={meterDashData?.Device_ID}
              datetimeActiveStatus={
                getarray?.slice(-1)[0]?.date +
                "\t | \t" +
                getarray?.slice(-1)[0]?.time
              }
              activeChartChk={getarrayHour?.slice(-1)[0]?.flow}
              activestatusLabels={getarrayHour
                ?.slice(-24)
                ?.map((time) => moment(time?.datetime).format("DD |HH:mm"))}
              activestatusflow={getarrayHour
                ?.slice(-24)
                ?.map((dataa) => dataa?.flow)}
              activeflowChk={getarray?.[getarray?.length - 1]?.flow}
              activemachineIDChk={meterDashData?.machineID}
              activeDayAvgChk={getarray?.[getarray?.length - 1]?.total}
              activetotalthismonthChk={getarray?.[getarray?.length - 1]?.total}
              activetotalChk={getarray?.[getarray?.length - 1]?.total}
              activelinetempChk={getarray?.[getarray?.length - 1]?.linetemp}
              activeflow={getarray?.[getarray?.length - 1]?.flow}
              activetotal={parseInt(
                getarray?.[getarray?.length - 1]?.total
              ).toLocaleString()}
              activeDayAvg={parseInt(AvgtotalMonth).toLocaleString()}
              activetotalthismonth={parseInt(totalthismonth).toLocaleString()}
              activelinetemp={parseInt(
                getarray?.[getarray.length - 1]?.linetemp
              ).toLocaleString()}
              dateFilter={
                <>
                  <div className="datepiker">
                    <DateRangePicker
                      showOneCalendar
                      placement="bottomStart"
                      className="rangepiker"
                      onChange={(event) => settingDate(event)}
                      value={value}
                      placeholder="Start Date ~ End Date"
                      renderValue={(value) => {
                        return (
                          moment(value[0])?.format("DD-MM-YYYY") +
                          " ~ " +
                          moment(value[1])?.format("DD-MM-YYYY")
                        );
                      }}
                    />
                    <button className="btnreport" onClick={findByDateDaily}>
                      {" "}
                      Report
                    </button>
                  </div>
                </>
              }
            />
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
}
