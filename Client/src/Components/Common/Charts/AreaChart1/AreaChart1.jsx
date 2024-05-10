import React from 'react'
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export default function AreaChart1(props) {

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: props.maxValueArea,
            }
        }

    };
    const labels = props.labels
    // const labels = meterDashData.slice(-24)?.map((time) => time?.time)
    const labelTemp = props.labelname1
    const labelHumid = props.labelname2
    // const labelTemp = 'Temperature'
    // const labelHumid = 'Humidity'
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: labelHumid,
                //   data: [10,42,13,74,25,23,54,65],
                data: props.humid,
                borderColor: 'rgb(41, 128, 185 )',
                backgroundColor: 'rgba(169, 204, 227, 0.7)',
                radius: 3,
                borderJoinStyle: 'round',
            },
            {
                fill: true,
                label: labelTemp,
                // label: 'Temperature' + '\t' + meterDashData[meterDashData.length - 1]?.value?.temp + '°C ',
                // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
                //   data: [10,42,13,74,25,23,54,65],

                // data: meterDashData[0]?.meterReadings.slice(-24).map((ddd)=>ddd?.temp),
                data: props.temp,
                borderColor: 'rgb(211, 84, 0 )',
                backgroundColor: 'rgba(237, 187, 153, 0.7)',
                borderJoinStyle: 'round',
            },
            
        ],
    };
  return (
    <>
    <Line options={options} data={data} height={285} width={350}/>
    </>
  )
}
