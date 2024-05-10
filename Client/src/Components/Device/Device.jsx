import React, { useEffect, useState } from "react";

// API
import { GetDeviceData, DeleteDeviceAPI } from "../../Service/DeviceAPI";
import { useLocation, useNavigate } from "react-router-dom";

// Helper
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiInformationLine } from "react-icons/ri";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

// Styling
import "./Device.scss";
// Asserts
import NoImage from "../../Asserts/Imgs/noImg.png";

// Other Components
import { useSelector } from "react-redux";
import { Button } from "antd";
import ROLES from "../../Utils/Roles";
import ConfirmationModel from "../Common/ConfirmationModel/ConfirmationModel";
import ImgURL from "../../Utils/ImgUrlGen";
import { BsArrowLeftShort } from "react-icons/bs";
import moment from "moment";
import AreaChart from "../Common/Charts/AreaChart1/AreaChart";
import { DateRangePicker } from "rsuite";

// ------------------------------------------Start Function------------------------

export default function Device() {
  // Searching the data from start to end date------------
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
  const [refreshPage, setRefreshPage] = useState(false);
  const [deviceData, setDeviceData] = useState([]);
  const [showFullHeading, setShowFullHeading] = useState(false);
  const [showFullDescription, setshowFullDescription] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    deviceId: null,
    loading: false,
  });

  const machine = location?.state?.machine;
  const buildingId = location?.state?.buildingId;
  const departmentId = location?.state?.departmentId;

  let machineId = machine?._id;

  const gettingDeviceData = async () => {
    let payload = {
      machineId: machineId,
    };
    let res = await GetDeviceData(payload);
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      setDeviceData(res?.data?.result);
    }
  };
  useEffect(() => {
    gettingDeviceData();
  }, [refreshPage]);

  const handleEditDevice = (device) => {
    navigate("/device/add", {
      state: {
        device: device,
        machineId: machineId,
        buildingId: buildingId,
        departmentId: departmentId,
      },
    });
  };

  // Getting User Data
  const userData = useSelector((state) => state?.userData);

  const handleAddDevice = () => {
    navigate("/device/add", {
      state: {
        machineId: machineId,
        buildingId: buildingId,
        departmentId: departmentId,
      },
    });
  };

  const goNext = (data) => {
    navigate(`/dev?MQTT_ID=${data?.MQTT_ID}`);
  };

  const shortenHeading = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    } else {
      return text;
    }
  };
  const shortenDescription = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    } else {
      return text;
    }
  };
  const handleDeleteDeviceConfirmation = (device) => {
    setDeleteConfirmation({
      open: true,
      deviceId: device?._id,
      loading: false,
    });
  };

  //   Delete Device Handle
  const handleDeleteDevice = async (device) => {
    setDeleteConfirmation({
      ...deleteConfirmation,
      loading: true,
    });
    const res = await DeleteDeviceAPI(deleteConfirmation?.deviceId);
    if (res?.error != null) {
      toast.error(res.error);
    } else {
      toast.success(res?.data?.message);
      setRefreshPage(!refreshPage);
    }
    setDeleteConfirmation({
      open: false,
      deviceId: null,
      loading: false,
    });
  };
  const handleNotDeleteDevice = () => {
    setDeleteConfirmation({
      open: false,
      deviceId: null,
      loading: false,
    });
  };

  // the function is use to find the date between start date and last date
  const findByDate = () => {
    let startDate = dateback?.startDate;
    let endDate = dateback?.endDate;
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let epStartDate = new Date(sDate - 18000000).getTime();
    let epEndDate = new Date(eDate + 69000000).getTime();
    let filterDate = deviceData?.map((meter) => {
      return {
        ...meter,
        meterReadings: meter?.DayReadings.filter((val) => {
          let currenDate = new Date(val?.datetime).getTime();
          if (currenDate >= epStartDate && currenDate <= epEndDate) {
            return true;
          } else {
            return false;
          }
        }),
      };
    });
    console.log(("this is filter", filterDate));

    navigate("/dev/report", {
      state: { date: sendDate, filterDate: filterDate },
    });
  };

  return (
    <>
      <div className="MainDeviceWithFooter">
        <div className="deviceMainContainer">
          <div className="deviceMain">
            <div className="deviceHeader">
              <div className="headleft">
                <BsArrowLeftShort
                  className="icon cursor"
                  onClick={() => navigate(-1)}
                />
                <div className="heading">{machine?.title}</div>
              </div>
              <div className="datepiker">
                <DateRangePicker
                  showOneCalendar
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
                <Button
                  className="btnreport EditBtn"
                  type="submit"
                  onClick={findByDate}
                >
                  {" "}
                  Report
                </Button>
              </div>
              {[ROLES.Admin, ROLES.SuperAdmin].includes(userData?.role) && (
                <Button className="EditBtn" onClick={handleAddDevice}>
                  Add Device
                </Button>
              )}
            </div>
            {deviceData && (
              <>
                <div className="tableMain">
                  <table>
                    <thead>
                      <tr>
                        <th>Particulars</th>
                        {deviceData?.map((data, i) => {
                          return (
                            <th key={i}>
                              <div className="titleMain">
                                <div className="title">
                                  {data?.title} <br />
                                  {data?.Device_ID}
                                </div>

                                {[ROLES.Admin, ROLES.SuperAdmin].includes(
                                  userData?.role
                                ) && (
                                  <span className="editDelete">
                                    <Button
                                      className="EditBtn"
                                      onClick={() => handleEditDevice(data)}
                                    >
                                      <AiFillEdit size={24} />
                                    </Button>
                                    <Button
                                      className="DelBtn"
                                      onClick={() =>
                                        handleDeleteDeviceConfirmation(data)
                                      }
                                    >
                                      <AiFillDelete size={24} />
                                    </Button>
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Flow</th>
                        {deviceData?.map((data, i) => {
                          return (
                            // data?.meterReadings?.[0]?.flow || data?.meterReadings?.[0]?.power && (
                            <td key={i}>
                              {data?.meterReadings?.[0]?.flow &&
                                data?.meterReadings?.[0]?.flow}
                              {data?.meterReadings?.[0]?.flow &&
                              data?.title == "Gas Flow Meter"
                                ? " M3/H"
                                : data?.title == "Steam Flow Meter"
                                ? " KG"
                                : data?.title == "Water Flow Meter"
                                ? " M3/H"
                                : data?.title == "Energy"
                                ? " KW/H"
                                : data?.title == "Production"
                                ? " M/MIN"
                                : " M3/H"}
                              {data?.meterReadings?.[0]?.pressure &&
                                ` | ${data?.meterReadings?.[0]?.pressure} PSI`}
                              {data?.meterReadings?.[0]?.lineTemp &&
                                `| ${data?.meterReadings?.[0]?.lineTemp} °C`}
                              {data?.meterReadings?.[0]?.power &&
                                `${data?.meterReadings?.[0]?.power} KW/H`}
                              {data?.meterReadings?.[0]?.battery &&
                                `${data?.meterReadings?.[0]?.battery} V`}
                              {data?.meterReadings?.[0]?.amp &&
                                `${data?.meterReadings?.[0]?.amp}`}
                              {data?.meterReadings?.[0]?.production &&
                                `${data?.meterReadings?.[0]?.production} m`}
                            </td>
                            // )
                          );
                        })}
                      </tr>
                      <tr>
                        <th>Total</th>
                        {deviceData?.map((data, i) => {
                          return (
                            <td key={i}>
                              {/* {data?.meterReadings?.[0]?.total && (
                                <> */}
                              {data?.meterReadings?.[0]?.total &&
                                parseInt(
                                  data?.meterReadings?.[0]?.total
                                ).toLocaleString()}
                              {data?.meterReadings?.[0]?.total &&
                              data?.title == "Gas Flow Meter"
                                ? " M3"
                                : data?.title == "Steam Flow Meter"
                                ? " TON"
                                : data?.title == "Water Flow Meter"
                                ? " M3"
                                : data?.title == "Energy"
                                ? " KW"
                                : data?.title == "Production"
                                ? " METER"
                                : " M3"}
                              {/* </>
                              )} */}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <th>Update</th>
                        {deviceData?.map((data, i) => {
                          return (
                            <td key={i}>
                              {moment(
                                data?.meterReadings?.[0]?.datetime
                              ).format("DD-MM-YYYY |HH:mm")}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {deviceData?.map((data, i) => {
              return (
                <div className="areaChartSteamFlow" key={i}>
                  <AreaChart
                    labels={data?.HourReadings?.slice(-24)?.map((time) =>
                      moment(time?.datetime).format("DD |HH:mm")
                    )}
                    flow={data?.HourReadings?.slice(-24)?.map((data) =>
                      parseInt(data?.flow)
                    )}
                    flowlabel={data?.title}
                    borderColor={
                      data?.title == "Gas Flow Meter"
                        ? "rgb(255,255,0)"
                        : data?.title == "Steam Flow Meter"
                        ? "rgb(128,128,128)"
                        : data?.title == "Water Flow Meter"
                        ? "rgb(0,128,255)"
                        : data?.title == "Energy"
                        ? "rgb(255,51,51)"
                        : data?.title == "Production"
                        ? "rgb(0,153,0)"
                        : "rgb(128,128,128)"
                    }
                    backGroundColor={
                      data?.title == "Gas Flow Meter"
                        ? "rgba(255,254,0,0.5)"
                        : data?.title == "Steam Flow Meter"
                        ? "rgba(128,128,128,0.5)"
                        : data?.title == "Water Flow Meter"
                        ? "rgba(0,128,255,0.5)"
                        : data?.title == "Energy"
                        ? "rgba(255,51,51,0.5)"
                        : data?.title == "Production"
                        ? "rgba(0,153,0,0.5)"
                        : "rgba(128,128,128,0.5)"
                    }
                  />
                </div>
              );
            })}

            {/* {deviceData?.[0] && (
              <div className="deviceCard">
                {deviceData?.map((data, i) => {
                  // const meterRead = data?.meterReadings
                  return (
                    <div key={i} className="devicemain">
                      <img
                        onClick={() => goNext(data)}
                        className="industoryimg"
                        src={
                          data?.image?.url
                            ? `http://localhost:4000/static/${data?.image?.url}`
                            : ImgURL(NoImage)
                        }
                        alt={"No Image"}
                      />

                      <div className="deviceName" onClick={() => goNext(data)}>
                        {showFullHeading
                          ? data?.title?.replace(/<[^>]+>/g, "")
                          : shortenHeading(data?.title, 20)}
                        <br />{" "}
                        <span className="deviceID">{data?.Device_ID}</span>
                      </div>
                      <div className="MainReadings">
                        <div className="Reading">
                          <div className="left">Status :</div>
                          <div className="right">OFF</div>
                        </div>
                        <div className="Reading">
                          <div className="left">Flow :</div>
                          <div className="right">
                            {data?.meterReadings?.slice(-1)[0]?.flow} m3
                          </div>
                        </div>
                        <div className="Reading">
                          <div className="left">Total Flow :</div>
                          <div className="right">
                            {parseInt(
                              data?.meterReadings?.slice(-1)[0]?.total
                            ).toLocaleString()}{" "}
                            Ton/Hr
                          </div>
                        </div>
                        <div className="Reading">
                          <div className="left">Line Temp :</div>
                          <div className="right">
                            4{data?.meterReadings?.slice(-1)[0]?.lineTemp} °C
                          </div>
                        </div>
                        <div className="Reading">
                          <div className="left">Date | Time :</div>
                          <div className="right">
                            {moment(data?.meterReadings?.datetime).format(
                              "DD-MM-YYYY |HH:mm"
                            )}
                          </div>
                        </div>
                      </div>
                      {[ROLES.Admin, ROLES.SuperAdmin].includes(
                        userData?.role
                      ) && (
                        <div className="cartBtns">
                          <Button
                            className="EditBtn"
                            onClick={() => handleEditDevice(data)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="DelBtn"
                            onClick={() => handleDeleteDeviceConfirmation(data)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )} */}
          </div>
        </div>
      </div>

      <ConfirmationModel
        open={deleteConfirmation.open}
        onOk={handleDeleteDevice}
        onCancel={handleNotDeleteDevice}
        confirmLoading={deleteConfirmation.loading}
        test={deleteConfirmation?.deviceId}
      >
        <div className="deleteModel">
          <div className="titleBox">
            <RiInformationLine className="icon" />{" "}
            <div className="title">
              {" "}
              Are you sure you want to delete this Device?{" "}
            </div>
          </div>
        </div>
      </ConfirmationModel>
    </>
  );
}
