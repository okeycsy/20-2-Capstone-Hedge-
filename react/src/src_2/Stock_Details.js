import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TouchableHighlightBase } from 'react-native';
import { getTouchProps } from 'react-stockcharts/lib/utils';

import ChartCompontent from '../Charts'

export default function Stock_Details({route, navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({
    yesterday_close: 0,
    high: 0,
    low: 0,
    today_close: 0,
    volume: 0,
  });

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
    console.log("acutal load")
    setData({
      yesterday_close:yc,
      high:h,
      low:l,
      today_close:t,
      volume: v,
    })
  }

  const company = route.params.name
  console.log(data)
  console.log(isLoading)
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (        
        <View style= {styles.borderContainer}>
          <View style={styles.chart}><ChartCompontent company={ company } load = { load } /></View>
          <View style={styles.borderTable}>
            <View style={styles.rowView}><Text>전일 종가</Text><Text>{parseInt(data.yesterday_close)} 원</Text></View>
            <View style={styles.rowView}><Text>당일 종가</Text><Text>{parseInt(data.today_close)} 원</Text></View>
            <View style={styles.rowView}><Text>당일 고가</Text><Text>{parseInt(data.high)} 원</Text></View>
            <View style={styles.rowView}><Text>당일 저가</Text><Text>{parseInt(data.low)} 원</Text></View>
            <View style={styles.rowView}><Text>거래량</Text><Text>{parseInt(data.volume)} 주</Text></View>
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
      width:'100%',
  },
  rowView: {
    width: '80%',
    marginBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});
