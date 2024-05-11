import React from "react";
import "./ReportMachineHour.css";
import Header from "../Common/Header/Header";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import moment from "moment";
import AreaChart from "../Common/Charts/AreaChart1/AreaChart";

const ReportMachine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const date = location.state.date;
  const roomName = location.state.roomName;
  let array = location?.state?.filterDateHour;
  let ar = array[0]?.HourReadings;
  let arr = [].concat(ar).reverse();

  // Get Total Values
  let arrLen = arr.length;
  let totalT = arr[0]?.total - arr[arr.length - 1]?.total;
  let totalAvg = totalT / arrLen;
  let linetemp = 0;
  let addlinetemp = arr?.map((data) => {
    return parseFloat(data?.linetemp);
  });
  for (var i in addlinetemp) {
    linetemp += addlinetemp[i];
  }
  let linetempavg = linetemp / arrLen;
  // console.log(linetempavg)

  const reportformat =
    "Tracking World\t" +
    roomName +
    "\t" +
    date.startDate +
    "\t\t" +
    date.endDate;
  const pdfbtn = () => {
    var doc = new jsPDF("l", "pt");
    var content = document.getElementById("reportid");
    doc.html(content, {
      callback: function (doc) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(12);
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          // doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
          doc.text(
            "Page" + String(i) + " of " + String(pageCount),
            842 - 30,
            595 - 30,
            null,
            null,
            "right"
          );
        }
        doc.save(reportformat);
      },
    });
  };
  const close = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="reportmain">
        <div className="headleft">
          <BsArrowLeftShort
            className="icon cursor"
            onClick={() => navigate(-1)}
          />
          <div className="heading">Hourly Report</div>
        </div>
        <div className="report" id="reportid">
          <div className="date">{arr[arr?.length - 1]?.date}</div>
          <div className="reportsMainContainer">
            {array?.map((data, index) => {
              return (
                <>
                  <table className="tablemain" id="tablee" key={index}>
                    <thead className="tablehead">
                      <tr>
                        {index === 0 &&
                          data?.HourReadings[data?.HourReadings.length - 1]
                            ?.date && (
                            <th className="tableh" rowSpan="2">
                              Time | Date
                            </th>
                          )}
                        <th className="tableh" colSpan="5">
                          {data?.title}
                        </th>
                      </tr>
                      <tr className="tablerow">
                        {/* <th className="tableh">Time | Date</th> */}
                        {data?.HourReadings?.[data?.HourReadings?.length - 1]
                          ?.total && (
                          <th className="tableh">
                            Flow{" "}
                            {data?.meterReadings?.flow &&
                            data?.title === "Gas Flow Meter"
                              ? " M3/H"
                              : data?.title === "Steam Flow Meter"
                              ? " KG"
                              : data?.title === "Water Flow Meter"
                              ? " M3/H"
                              : data?.title === "Energy"
                              ? " KW/H"
                              : data?.title === "Production"
                              ? " M/MIN"
                              : " M3/H"}
                          </th>
                        )}
                        {data?.HourReadings?.[data?.HourReadings?.length - 1]
                          ?.total && (
                          <th className="tableh">
                            Total{" "}
                            {data?.title === "Gas Flow Meter"
                              ? " M3"
                              : data?.title === "Steam Flow Meter"
                              ? " TON"
                              : data?.title === "Water Flow Meter"
                              ? " M3"
                              : data?.title === "Energy"
                              ? " KW"
                              : data?.title === "Production"
                              ? " METER"
                              : " M3"}
                          </th>
                        )}
                        {data?.HourReadings?.[data?.HourReadings?.length - 1]
                          ?.linetemp && (
                          <th className="tableh">Line Temp °C</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {data?.HourReadings?.map((ddd, i, newArray) => {
                        let previousTotal = i > 0 ? newArray[i - 1]?.total : 0;
                        let difference = ddd?.total - previousTotal;
                        return (
                          <tr className="tablerow" key={i}>
                            <>
                              {index === 0 && (
                                <td className="tabled">
                                  {ddd?.time} | {ddd?.date}
                                </td>
                              )}
                              {ddd?.total && (
                                <td className="tabled">
                                  {parseInt(difference).toLocaleString()}
                                  {/* {parseInt(
                                    ddd?.totalHourReduction
                                  ).toLocaleString()} */}
                                  {/* {ddd?.pressure && ` | ${ddd?.pressure} PSI`} */}
                                  {/* {ddd?.linetemp && ` | ${ddd?.linetemp} °C`} */}
                                  {/* {ddd?.power && ` | ${ddd?.power} KW/H`}
                                  {ddd?.battery && ` | ${ddd?.battery} V`}
                                  {ddd?.amp && ` | ${ddd?.amp}`}
                                  {ddd?.production && ` | ${ddd?.production} m`} */}
                                </td>
                              )}
                              {data?.HourReadings?.[
                                data?.HourReadings?.length - 1
                              ]?.total && (
                                <td className="tabled">
                                  {parseInt(ddd?.total).toLocaleString()}{" "}
                                </td>
                              )}
                              {data?.HourReadings?.[
                                data?.HourReadings?.length - 1
                              ]?.linetemp && (
                                <td className="tabled">
                                  {parseInt(ddd?.linetemp).toLocaleString()}{" "}
                                </td>
                              )}
                            </>
                          </tr>
                        );
                      })}

                      <tr className="tablerow">
                        {index === 0 && (
                          <th className="tableh tablehead">Avg | Total</th>
                        )}
                        {data?.HourReadings?.[data?.HourReadings?.length - 1]
                          ?.total && (
                          <td className="tableh tablehead">
                            {parseInt(
                              (data?.HourReadings[
                                data?.HourReadings?.length - 1
                              ]?.total -
                                data?.HourReadings[0]?.total) /
                                data?.HourReadings?.length
                            ).toLocaleString()}
                          </td>
                        )}
                        {data?.HourReadings?.[data?.HourReadings?.length - 1]
                          ?.total && (
                          <td className="tableh tablehead">
                            {parseInt(
                              data?.HourReadings[data?.HourReadings?.length - 1]
                                ?.total - data?.HourReadings[0]?.total
                            ).toLocaleString()}
                          </td>
                        )}
                        {data?.HourReadings?.[data?.HourReadings?.length - 1]
                          ?.linetemp && (
                          <td className="tableh tablehead">
                            {/* {parseInt(linetempavg).toLocaleString()} */}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </>
              );
            })}
          </div>
        </div>

        <div className="btnss">
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="excelbtn"
            table="tablee"
            filename={reportformat}
            sheet="tablexls"
            buttonText="Excel"
          />
          <button className="pdfbtn" onClick={pdfbtn}>
            Pdf
          </button>
          <button className="pdfbtn" onClick={close}>
            Close
          </button>
        </div>
        {array?.map((data, i) => {
          return (
            <div className="areaChartSteamFlow" key={i}>
              <AreaChart
                labels={data?.HourReadings?.map((time) =>
                  moment(time?.datetime).format("HH:mm")
                )}
                flow={data?.HourReadings?.map((data) =>
                  parseInt(data?.totalHourReduction)
                )}
                flowlabel={data?.title}
                borderColor={
                  data?.title === "Gas Flow Meter"
                    ? "rgb(255,254,0)"
                    : data?.title === "Steam Flow Meter"
                    ? "rgb(128,128,128)"
                    : data?.title === "Water Flow Meter"
                    ? "rgb(0,128,255)"
                    : data?.title === "Energy"
                    ? "rgb(255,51,51)"
                    : data?.title === "Production"
                    ? "rgb(0,153,0)"
                    : "rgb(128,128,128)"
                }
                backGroundColor={
                  data?.title === "Gas Flow Meter"
                    ? "rgba(255,254,0,0.5)"
                    : data?.title === "Steam Flow Meter"
                    ? "rgba(128,128,128,0.5)"
                    : data?.title === "Water Flow Meter"
                    ? "rgba(0,128,255,0.5)"
                    : data?.title === "Energy"
                    ? "rgba(255,51,51,0.5)"
                    : data?.title === "Production"
                    ? "rgba(0,153,0,0.5)"
                    : "rgba(128,128,128,0.5)"
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ReportMachine;
