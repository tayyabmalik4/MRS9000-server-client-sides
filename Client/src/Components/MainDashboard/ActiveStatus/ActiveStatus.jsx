import React from "react";
import AreaChart from "../../Common/Charts/AreaChart1/AreaChart";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import "./ActiveStatus.css";

export default function ActiveStatus(props) {
  return (
    <>
      <div className="activestatusmain">
        <div className="headeractivestatus">
          <div className="header1">
            <div className="avtivestatusname">Live Metering</div>
            <div className="datetimestatus">{props.datetimeActiveStatus}</div>
            {/* <div className="avtivestatusname">{props.roomName} <span className="deviceID">({props.deviceID})</span> </div> */}
          </div>
          <div className="header2">
            <div className="activestatuslogo">
              {props.dateFilter}
              {/* <div className="livestatusname">Live Status</div>
            <div className="livestatuslogo">
            <AutoGraphIcon />
          </div> */}
            </div>
          </div>
        </div>

        <div className="activevalues">
          {props.activetotalChk && (
            <>
              <div className="valuemain value2main">
                <div className="valueName valueName2">Total Flow m3</div>
                <div className="valuee vlauee2">
                  <span className="val val2">{props.activetotal}</span>
                </div>
              </div>
            </>
          )}
          {props.activeflowChk && (
            <>
              <div className="valuemain value1main">
                <div className="valueName valueName1">Flow m3/hr</div>
                <div className="valuee vlauee1">
                  <span className="val val2">{props.activeflow}</span>
                </div>
              </div>
            </>
          )}
          {props.activelinetempChk && (
            <>
              <div className="valuemain value3main">
                <div className="valueName valueName3">Line Temp °C</div>
                <div className="valuee vlauee3">
                  <span className="val val2">{props.activelinetemp}</span>
                </div>
              </div>
            </>
          )}
          {props.activeDayAvgChk && (
            <>
              <div className="valuemain value3main">
                <div className="valueName valueName3">Daily m3</div>
                <div className="valuee vlauee3">
                  <span className="val val2">{props.activeDayAvg}</span>
                </div>
              </div>
            </>
          )}
          {props.activetotalthismonthChk && (
            <>
              <div className="valuemain value3main">
                <div className="valueName valueName3">This Month m3</div>
                <div className="valuee vlauee3">
                  <span className="val val2">{props.activetotalthismonth}</span>
                </div>
              </div>
            </>
          )}
          {/* ASL means Approximate Steam Load */}
          {props.activemachineIDChk === "boiler" ? (
            <>
              <div className="valuemain1 value4main">
                <div className="valueName valueName4">Steam Load TPH</div>
                <div className="valuee vlauee4">
                  <span className="val val3">
                    {parseFloat(props.activeflow / 80).toFixed(1)}
                  </span>
                </div>
              </div>
            </>
          ) : props.activemachineIDChk === "power" ? (
            <>
              <div className="valuemain1 value4main">
                <div className="valueName valueName4">Power KW</div>
                <div className="valuee vlauee4">
                  <span className="val val4">
                    {(parseFloat(props.activeflow / 0.29).toFixed(1))}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="areachart">
          {props.activeChartChk && (
            <>
            <div className="chartareahori">
            <div className="flowtag">Flow</div>
              <AreaChart
                labels={props.activestatusLabels}
                flow={props.activestatusflow}
                flowlabel="Flow"
                />
                </div>
              <div className="graphName">Date Time</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
