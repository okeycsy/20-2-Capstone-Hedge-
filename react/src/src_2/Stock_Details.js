import { style } from 'd3';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import ChartCompontent from '../Charts'

const stock_data = {
  yesterday_close:37300,
  high:377500,
  low:36600,
  today_close:37750,
  volume: 700638,
}

export default function Stock_Details( ) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(stock_data)
    setLoading(false)
  }, []);


  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (        
        <View style= {styles.borderContainer}>
          <View style={styles.chart}><ChartCompontent/></View>
        
          <View style={styles.borderTable}>
            <View style={styles.row}><Text>전날 종가</Text><Text>{data.yesterday_close}</Text></View>
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
