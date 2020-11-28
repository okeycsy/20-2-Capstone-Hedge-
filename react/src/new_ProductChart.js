import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { Scatter } from 'react-chartjs-2'
import {Button} from 'react-native';
import * as jqcsv from 'jquery-csv';
import Product from './Dividend'
import { text } from 'd3';

const data = {
    datasets: [
      {
        label: 'A dataset',
        data:
        [
          {x: 1, y: 2},
          {x: 3, y: 4},
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

let count = 0

function ScatterChart() {
    const [data2, setData] = useState({});

    useEffect(() => {
        if (count > 1) {
          return;
        }
        fetch('http://swlab.uos.ac.kr/api_bond')
        .then((response) => response.text())
        .then((text) => setData(text))

        count = 1
        console.log(data2)
        console.log("count = 1")
    });

    if (typeof(data2) == typeof('string')) {
        console.log(data2)
        setData(data2.replace('\",\"', '\n'))
        console.log('convert')
        console.log(data2)
        count = 2
    }
    console.log(data2)
    // var d = getdata()
    // console.log(d)
    // data.datasets[0].data = d

    return (
        <div className='header'>
          <Button title="siba" onPress={() => {console.log(data2)}} />
          <h1 className='title' >financial product</h1>
          <div className='links'>
          </div>
          <Scatter data={data} options={options}/>
          <Product></Product>
        </div>
    )
}

export default ScatterChart