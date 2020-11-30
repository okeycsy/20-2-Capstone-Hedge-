import { style } from 'd3';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TouchableHighlightBase } from 'react-native';
import { getTouchProps } from 'react-stockcharts/lib/utils';

import ChartCompontent from '../Charts'

export default function Stock_Details({route, navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData({
      yesterday_close: 0,
      high: 0,
      low: 0,
      today_close: 0,
      volume: 0,
    })
    setLoading(false)
  }, []);

  function load(yc, h, l, t, v) {
    setData({
      yesterday_close:yc,
      high:h,
      low:l,
      today_close:t,
      volume: v,
    })
  }

  const company = route.params.name
  console.log(route)
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (        
        <View style= {styles.borderContainer}>
          <View style={styles.chart}><ChartCompontent company={ company } load = { load } /></View>
        
          <View style={styles.borderTable}>
            <View style={styles.row}><Text>전일 종가</Text><Text>{data.yesterday_close}</Text></View>
            <View style={styles.row}><Text>당일 종가</Text><Text>{data.today_close}</Text></View>
            <View style={styles.row}><Text>당일 고가</Text><Text>{data.high}</Text></View>
            <View style={styles.row}><Text>당일 저가</Text><Text>{data.low}</Text></View>
            <View style={styles.row}><Text>거래량</Text><Text>{data.volume}</Text></View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    paddingHorizontal: 10,
  },
  borderContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    width: '100%',
    marginVertical: '3%',
    justifyContent: 'center',
    alignContent: 'center'
  },
  borderTable: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  chart:{
      width:'100%'
  },
  row: {
    width: '80%',
    flex: 1,
    marginBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});
