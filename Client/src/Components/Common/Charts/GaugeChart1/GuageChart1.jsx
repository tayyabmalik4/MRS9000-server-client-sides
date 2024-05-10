import React from 'react'
import './GaugeChart1.css'
import Chart from "react-apexcharts";

export default function GuageChart1(props) {
  var stat = {
    series: [props?.val],
    chart: {
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    options: {
      // chart: {
      //   height: 350,
      //   // type: 'radialBar',
      //   toolbar: {
      //     show: false
      //   }
      // },
      plotOptions: {
        radialBar: {
          // startAngle: -135,
          // endAngle: 225,
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 0,
            size: '60%',
            background: props.hollowColor,
            // background: '#fff',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background: '#fff',
            strokeWidth: '67%',
            margin: 0,
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: 0,
              show: true,
              color: props.textColor,
              fontSize: props.textFontSize
            },
            value: {
              color: props.numColor,
              fontSize: props.valueFontSize,
              show: true,
              // formatter: function (val) {
                formatter: function (val) {
                return (val.toFixed(props.valfix)) + props.valpercent ;
              },
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [props.gradientColor],
          // gradientToColors: ['#ABE5A1'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: 'line'
      },
      labels: [props.name],
    },
  };


  return (
    <>
      <div id="gaugechart" className='guage'>
        <Chart options={stat.options} series={stat.series} type="radialBar" height={props.heightgraph} width={props.widthgraph}/>
      </div>
    </>
  )
}
