import React from 'react'
import { Line } from 'react-chartjs-2';
import './AreaChart.css';
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

export default function AreaChart(props) {

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display : true,
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
    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: props.flowlabel,
                //   data: [10,42,13,74,25,23,54,65],
                data: props.flow,
                borderColor: props.borderColor,
                backgroundColor: props.backGroundColor,
                radius: 3,
                borderJoinStyle: 'round',
            },
            
        ],
    };
  return (
    <>
    <div className='linechartmain'>
    <Line options={options} data={data}/>
    {/* <Line style={{minWidth:"49vw", height:"15vh"}} options={options} data={data}/> */}
    </div>
    </>
  )
}
