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

export default function AreaChart2(props) {

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
                max: props.maxValueArea
            }
        }

    };
    const labels = props.labels
    const labelTemp = props.labelname1
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: labelTemp,
                //   data: [10,42,13,74,25,23,54,65],
                data: props.temp,
                borderColor: 'rgb(211, 84, 0 )',
                backgroundColor: 'rgba(237, 187, 153, 0.7)',
                radius: 3,
                borderJoinStyle: 'round',
            },
            
        ],
    };
  return (
    <>
    <Line options={options} data={data} height={250} width={550}/>
    </>
  )
}
