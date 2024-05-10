const mqtt = require("mqtt");
const moment = require("moment");
const device = require("../model/deviceModel.js");

const deviceDB = () => {
  // const client = mqtt.connect('mqtt://amazonusa.link:1883');
  const client = mqtt.connect("mqtt://localhost:1883");
  client.on("connect", () => {
    if (client.connected) {
      console.log("MQTT protocol is connected successfully");
    }

    for (let i = 1; i < 1001; i++) {
      client.subscribe(`Data/MRS9000/Dev${i}`);
    }
  });

  client.on("message", async (topic, message) => {
    var stringBuf = message.toString("utf-8");
    try {
      var myobj3 = JSON.parse(stringBuf);
      if (
        myobj3.flow > -1 &&
        myobj3.total > -1 &&
        myobj3.flow < 999999999 &&
        myobj3.total < 999999999
      ) {
        var datetime = new Date().getTime();
        var datetimeHour = new Date().getHours();
        var datetimeDay = new Date().getDate();
        var datetimeMonth = new Date().getMonth();
        let date = moment(datetime).format("DD-MM-YYYY");
        let time = moment(datetime).format("HH:mm");
        try {
          let { MQTT_ID, Device_ID, flow, total, linetemp } = myobj3;
          const FindMeter = await device.findOne({ Device_ID: Device_ID });
          if (FindMeter) {
            // check every 2 minute time
            let gettimechk = FindMeter.meterReadings;
            let chktime = gettimechk[gettimechk.length - 1]?.datetime;
            // check hour time
            let gethourtimechk = FindMeter.HourReadings;
            let chkhourtime =
              gethourtimechk[gethourtimechk.length - 1]?.datetimeHour;
            // check one day time
            let getDay = FindMeter.DayReadings;
            let chkDay = getDay[getDay.length - 1]?.datetimeDay;
            // check one month time
            let getMonth = FindMeter.MonthReadings;
            let chkMonth = getMonth[getMonth.length - 1]?.datetimeMonth;
            // Hour Wise
            // total Reduction
            let totalHourReduction = 0;
            if (gethourtimechk[gethourtimechk.length - 2]) {
              totalHourReduction =
                myobj3.total - gethourtimechk[gethourtimechk.length - 2]?.total;
            } else {
              totalHourReduction = myobj3.total;
            }
            // Day Wise
            // total Reduction
            let totalDayReduction = 0;
            if (getDay[getDay.length - 2]) {
              totalDayReduction =
                myobj3.total - getDay[getDay.length - 2]?.total;
            } else {
              totalDayReduction = myobj3.total;
            }
            if (gettimechk.length < 1) {
              const addData = await device.findOneAndUpdate(
                { Device_ID: Device_ID },
                {
                  $push: {
                    meterReadings: {
                      flow,
                      total,
                      linetemp,
                      date,
                      time,
                      datetime,
                      datetimeHour,
                      datetimeDay,
                      datetimeMonth,
                    },
                  },
                },
                { new: true }
              );
              // console.log("Record Inserted SuccessFully");
            } else if (
              datetime < chktime + 120000 ||
              datetime > chktime + 120000
            ) {
              const addData = await device.findOneAndUpdate(
                {
                  Device_ID: Device_ID,
                  meterReadings: gettimechk[gettimechk.length - 1],
                },
                {
                  $set: {
                    "meterReadings.$": {
                      flow,
                      total,
                      linetemp,
                      linetemp,
                      date,
                      time,
                      datetime,
                      datetimeHour,
                      datetimeDay,
                      datetimeMonth,
                    },
                  },
                }
              );
              // console.log("Record Updated SuccessFully");
            }
            // if (datetimeHour != chkhourtime || gethourtimechk.length < 1) {
              const addData = await device.findOneAndUpdate(
                { Device_ID: Device_ID },
                {
                  $push: {
                    HourReadings: {
                      flow,
                      total,
                      linetemp,
                      totalHourReduction,
                      date,
                      time,
                      datetime,
                      datetimeHour,
                      datetimeDay,
                      datetimeMonth,
                    },
                  },
                },
                { new: true }
              );
              // console.log("Record Inserted SuccessFully on HourReadings");
            // } else if (datetimeHour == chkhourtime) {
            //   const addData = await device.findOneAndUpdate(
            //     {
            //       Device_ID: Device_ID,
            //       HourReadings: gethourtimechk[gethourtimechk.length - 1],
            //     },
            //     {
            //       $set: {
            //         "HourReadings.$": {
            //           flow,
            //           total,
            //           linetemp,
            //           totalHourReduction,
            //           date,
            //           time,
            //           datetime,
            //           datetimeHour,
            //           datetimeDay,
            //           datetimeMonth,
            //         },
            //       },
            //     }
            //   );
            //   // console.log("Record Updated SuccessFully on HourReadings");
            // }
            // if (datetimeDay != chkDay || getDay.length < 1) {
              await device.findOneAndUpdate(
                { Device_ID: Device_ID },
                {
                  $push: {
                    DayReadings: {
                      flow,
                      total,
                      linetemp,
                      totalDayReduction,
                      date,
                      time,
                      datetime,
                      datetimeHour,
                      datetimeDay,
                      datetimeMonth,
                    },
                  },
                },
                { new: true }
              );
              // console.log("Record Inserted SuccessFully on DayReadings");
            // } else if (datetimeDay == chkDay) {
            //   const addData = await device.findOneAndUpdate(
            //     {
            //       Device_ID: Device_ID,
            //       DayReadings: getDay[getDay.length - 1],
            //     },
            //     {
            //       $set: {
            //         "DayReadings.$": {
            //           flow,
            //           total,
            //           linetemp,
            //           totalDayReduction,
            //           date,
            //           time,
            //           datetime,
            //           datetimeHour,
            //           datetimeDay,
            //           datetimeMonth,
            //         },
            //       },
            //     }
            //   );
            //   // console.log("Record Updated SuccessFully on DayReadings");
            // }
          } else {
            console.log("Meter ID is not found");
          }
        } catch (err) {
          console.log("-----MQTT DB ERROR-----", err);
        }
      } else {
        console.log("Some Values is Out of Range");
      }
    } catch (error) {
      console.log("Array is not correctly stringyfy");
    }
  });
};
module.exports = deviceDB;
