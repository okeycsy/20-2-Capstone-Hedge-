import React from 'react';
import { render } from 'react-dom';

import { Scatter } from 'react-chartjs-2'

import $ from 'jquery-csv';

import Product from './Dividend'

const data = {
    datasets: [
      {
        label: 'A dataset',
        data: [
          {x: 1, y:1},
          {x: 13, y:10},
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
}

const ScatterChart = () => (
    <>
      <div className='header'>
        <h1 className='title'>Scatter Chart</h1>
        <div className='links'>
        </div>
      </div>
      <Scatter data={data} options={options} />
      <Product></Product>
    </>
  )

export default ScatterChart