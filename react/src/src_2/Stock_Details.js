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
    <View>
      {isLoading ? <ActivityIndicator/> : (        
        <View>
          <View><ChartCompontent/></View>

          <View style={styles.row}><Text>전날 종가</Text><Text>{data.yesterday_close}</Text></View>
          <View style={styles.row}><Text>당일 종가</Text><Text>{data.today_close}</Text></View>
          <View style={styles.row}><Text>당일 고가</Text><Text>{data.high}</Text></View>
          <View style={styles.row}><Text>당일 저가</Text><Text>{data.low}</Text></View>
          <View style={styles.row}><Text>거래량</Text><Text>{data.volume}</Text></View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flex: 1,
    marginBottom: 5,
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
});
