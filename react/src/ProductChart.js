import React from 'react';
import { render } from 'react-dom';

import { Scatter } from 'react-chartjs-2'

import * as jqcsv from 'jquery-csv';

import Product from './Dividend'

const data = {
    datasets: [
      {
        label: 'A dataset',
        data:
        [
          {x: 1, y: 2},
        ],
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
}

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
        var label = data.datasets[clickedDatasetIndex].label;
        var name = data.datasets[clickedDatasetIndex].data[clickedElementindex].이름;     
        console.log("Clicked: " + label + " - " + name);
      }
    },
}

function getdata() {
    console.log('getdata')
    var csv = jqcsv.csv = require('jquery-csv')
    var ch = "x,y,이름\n1,2,강\n3,4,약\n3,1,중\n2,1,강\n";   
    var res = csv.toObjects(ch)

    return res
    
}

const ScatterChart = () => {
    var d = getdata()
    console.log(d)
    data.datasets[0].data = d

    return (
        <div className='header'>
          <h1 className='title'>Scatter Chart</h1>
          <div className='links'>
          </div>
          <Scatter data={data} options={options}/>
          <Product></Product>
        </div>
    )
}

export default ScatterChart