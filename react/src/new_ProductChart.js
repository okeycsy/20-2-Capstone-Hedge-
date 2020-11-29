import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { Scatter } from 'react-chartjs-2'
import {Button} from 'react-native';
import * as jqcsv from 'jquery-csv';
import Product from './Dividend'

// export function App() {
//   // 참고 : https://reactnative.dev/docs/network
//   // setLoading과 setData는 setter 함수(이름은 마음대로 지어도 됨)
//   const [isLoading, setLoading] = useState(true);
//   const [data, setData] = useState(0);
  
//   // 서버에서 res.json 으로 보낸 json을 fetch를 통해 가져옴
//   // fetch에 쓰인 url은 document에서 예제로 쓴 것
//   // 끝의 []는 에러났을 때 []를 반환한다는 뜻
//   useEffect(() => {
//     fetch('https://swlab.uos.ac.kr/api')
//       .then((response) => response.json())
//       .then((json) => setData(json.bond))
//       //.catch((error) => console.error(error))
//       //.finally(() => setLoading(false));
//       console.log(json)
//   }, []);

//   // setData : setter 함수
//   // setter 함수를 통해 상태를 바꾸고, 상태가 바뀔 때마다 render
//   // test : 클릭하면 맨 앞 요소 삭제
//   const test = () => {
//     // 깊은 복사 후, 수정하고 setter함수에 전달
//     // 비효율적인 방법이지만, 다른 방법을 아직 모르겠음
//     // data.shift(); setData(data)는 안됨...
//     // 하지만, 예를 들어 data가 숫자고, 1을 증가시키고 싶다면,
//     // setData(prevData => prevData + 1); 이렇게 하면 숫자가 1 증가
//     let temp_data = JSON.parse(JSON.stringify(data)) 
//     temp_data.shift()
//     setData(temp_data)
//   }
// }

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

const ScatterChart = () => {
    const [data2, setData] = useState({});
  
    useEffect(() => {
           fetch('https://swlab.uos.ac.kr:3000/api_bond')
            .then((response) => response.json())
            .then((json) => setData(json))
      }, );


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