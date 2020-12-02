import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';

import { VictoryChart, VictoryTheme, VictoryScatter, VictoryZoomContainer } from 'victory-native'
import { Button, View, Text, StyleSheet, ScrollView } from 'react-native';
import * as jqcsv from 'jquery-csv';
import Product from './Deposit'
import { text } from 'd3';


let step = 0

function initStep() {
  step = 0
}

function ScatterChart() {
    const [chartdata, setChartdata] = useState([]);
    const [bond, setBond] = useState({});
    const [dividend, setDividend] = useState({});
    const [deposit, setDeposit] = useState({});
    const [saving, setSaving] = useState({});

    useEffect(() => {
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
          fetch('http://swlab.uos.ac.kr/api_dep')
          .then((response) => response.text())
          .then((text) => {
            text = text.replace("수익률", "y")
            text = text.replace("위험도", "x")
            console.log("fetch dep")
            console.log(step)
            var csv = jqcsv.csv = require('jquery-csv')
            var res = csv.toObjects(text)
            if (step == 2) {
              step = 3
              setDeposit(res)
            }
          });
        }
        else if (step == 3) {
          fetch('http://swlab.uos.ac.kr/api_sav')
          .then((response) => response.text())
          .then((text) => {
            text = text.replace("수익률", "y")
            text = text.replace("위험도", "x")
            console.log("fetch sav")
            console.log(step)
            var csv = jqcsv.csv = require('jquery-csv')
            var res = csv.toObjects(text)
            if (step == 3) {
              step = 4
              setSaving(res)
            }
          });
        }
        else if (step == 4) {
          step = 5;
          let tmp = bond.concat(dividend)
          tmp = tmp.concat(deposit)
          tmp = tmp.concat(saving)
          setChartdata(
            tmp
            // data: [
            //   {
            //     label: '채권',
            //     data: bond,
            //     backgroundColor: 'rgba(255, 99, 132, 1)',
            //   },
            //   {
            //     label: '배당금',
            //     data: dividend,
            //     backgroundColor: 'rgba(99, 255, 132, 1)',
            //   },
            //   {
            //     label: '예금',
            //     data: deposit,
            //     backgroundColor: 'rgba(99, 99, 255, 1)',
            //   },
            //   {
            //     label: '적금',
            //     data: saving,
            //     backgroundColor: 'rgba(255, 99, 255, 1)',
            //   },
            // ],
          )
        }
        else if (step == 5) {
          if (chartdata.length == 0) {
            step = 0;
            setBond(0)
          }
        }
    });
    console.log((chartdata))
    console.log(typeof(chartdata))
    console.log('로그')

    return (
        <View container style={styles.container}>
          <ScrollView>
            <Text style={styles.text}>전체 금융상품</Text>
            <Text>
            </Text>
            <VictoryChart
              containerComponent= {<VictoryZoomContainer/>}>
              <VictoryScatter
                data={chartdata}
                style={{ data: { fill: "#c43a31" } }}
                size={7}
                x="x"
                y="y"/>
            </VictoryChart>
            <View p style={styles.productData}>
              <Product/>
            </View>
          </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0%',
    marginBottom: '5%',
    paddingHorizontal: 10,
  },
  rowContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    width: '85%',
    marginVertical: '3%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  productData: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center'
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    margin: 30,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '30%',
    height: '100%',
  },
});

export default ScatterChart