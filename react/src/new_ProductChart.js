import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { Scatter } from 'react-chartjs-2'
import plugins from 'chartjs-plugin-zoom'
import {Button} from 'react-native';
import * as jqcsv from 'jquery-csv';
import Product from './Dividend'
import { text } from 'd3';

function getdata(data2) {
    console.log('getdata')
    var csv = jqcsv.csv = require('jquery-csv')
    console.log(data2)
    var res = csv.toObjects(data2)
    console.log(res)

    setChartdata({
      datasets: [
        {
          label: 'A dataset',
          data: res,
          backgroundColor: 'rgba(255, 99, 132, 1)',
        },
      ],
  })
}

let step = 0

function ScatterChart() {
    const [chartdata, setChartdata] = useState({});
    const [bond, setBond] = useState({});
    const [dividend, setDividend] = useState({});
    const [deposit, setDeposit] = useState({});
    const [saving, setSaving] = useState({});

    useEffect(() => {
<<<<<<< HEAD
           fetch('https://swlab.uos.ac.kr:3000/api_bond')
            .then((response) => response.json())
            .then((json) => setData(json))
      }, );

=======
        if (step == 0) {
          fetch('http://swlab.uos.ac.kr/api_bond')
          .then((response) => response.text())
          .then((text) => {
            text = text.replace("수익률", "y")
            text = text.replace("변동성", "x")
            console.log("fetch bond")
            var csv = jqcsv.csv = require('jquery-csv')
            var res = csv.toObjects(text)
            if (step == 0) {
              step = 1
              setBond(res)
            }
          });
        }
        else if (step == 1) {
          fetch('http://swlab.uos.ac.kr/api_div')
          .then((response) => response.text())
          .then((text) => {
            text = text.replace("수익률", "y")
            text = text.replace("위험도", "x")
            console.log("fetch div")
            console.log(step)
            var csv = jqcsv.csv = require('jquery-csv')
            var res = csv.toObjects(text)
            if (step == 1) {
              step = 2
              setDividend(res)
            }
          });
        }
        else if (step == 2) {
          step = 3;
          setChartdata({
            datasets: [
              {
                label: '채권',
                data: bond,
                backgroundColor: 'rgba(255, 99, 132, 1)',
              },
              {
                label: '배당금',
                data: dividend,
                backgroundColor: 'rgba(99, 255, 132, 1)',
              },
            ],
          })
          console.log(chartdata.datasets)
        }
        else if (step = 3) {
          
        }
        else if (step = 4) {
          
        }
    });
>>>>>>> 74aff1f043831415d13634efb68b1977c3dceeb5

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      events: ['click'],
      onClick: function(event, elements) {
        console.log(elements)
        // make sure click was on an actual point
        if (elements.length > 0) {
          var clickedDatasetIndex = elements[0]._datasetIndex;
          var clickedElementindex = elements[0]._index;
          var label = chartdata.datasets[clickedDatasetIndex].label;
          var name = chartdata.datasets[clickedDatasetIndex].data[clickedElementindex].상품명;     
          console.log("Clicked: " + label + " - " + name);
        }
      },
      plugins: {
        zoom: {
          // Container for pan options
          pan: {
            // Boolean to enable panning
            enabled: true,
      
            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            // A function that is called as the user is panning and returns the
            // available directions can also be used:
            //   mode: function({ chart }) {
            //     return 'xy';
            //   },
            mode: 'xy',
      
            rangeMin: {
              // Format of min pan range depends on scale type
              x: null,
              y: null
            },
            rangeMax: {
              // Format of max pan range depends on scale type
              x: null,
              y: null
            },
      
            // On category scale, factor of pan velocity
            speed: 20,
      
            // Minimal pan distance required before actually applying pan
            threshold: 10,
      
            // Function called while the user is panning
          },
      
          // Container for zoom options
          zoom: {
            // Boolean to enable zooming
            enabled: true,
      
            // Enable drag-to-zoom behavior
            drag: true,
      
            // Drag-to-zoom effect can be customized
            // drag: {
            // 	 borderColor: 'rgba(225,225,225,0.3)'
            // 	 borderWidth: 5,
            // 	 backgroundColor: 'rgb(225,225,225)',
            // 	 animationDuration: 0
            // },
      
            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            // A function that is called as the user is zooming and returns the
            // available directions can also be used:
            //   mode: function({ chart }) {
            //     return 'xy';
            //   },
            mode: 'xy',
      
            rangeMin: {
              // Format of min zoom range depends on scale type
              x: null,
              y: null
            },
            rangeMax: {
              // Format of max zoom range depends on scale type
              x: null,
              y: null
            },
      
            // Speed of zoom via mouse wheel
            // (percentage of zoom on a wheel event)
            speed: 0.1,
      
            // Minimal zoom distance required before actually applying zoom
            threshold: 2,
      
            // On category scale, minimal zoom level before actually applying zoom
            sensitivity: 3,
      
            // Function called while the user is zooming
            onZoom: function({chart}) { console.log(`I'm zooming!!!`); },
            // Function called once zooming is completed
            onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
          }
        }
      }
  }
    // var d = getdata()
    // console.log(d)
    // data.datasets[0].data = d

    return (
        <div className='header'>
          <Button title="siba" onPress={() => {console.log(data2)}} />
          <h1 className='title' >financial product</h1>
          <div className='links'>
          </div>
          <Scatter data={chartdata} options={options}/>
          <Product></Product>
        </div>
    )
}

export default ScatterChart