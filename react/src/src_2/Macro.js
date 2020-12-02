import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function Macro() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idx, setIdx] = userState(0);


  // field1: 자기 자신
  // NASDAQ. DOW JONES, KOSPI, Gold, CRUDE OIL, USD/KRW, 미 10년 국고채, 미 30년 국고채, 비트코인
  useEffect(() => {
    fetch('http://swlab.uos.ac.kr/api_macro_coef')
      .then((response) => response.json())
      // 소수점 자리 조정
      .then(function(result) {
          let keys = Object.keys(result[0]);
          for(let i = 0; i < result.length; i++) {
              for(let j = 1; j < keys.length; j++) {
                  result[i][keys[j]] = parseFloat(parseFloat(result[i][keys[j]]).toFixed(3));
              }
          }
          return result;
      })
      .then(result => setData(result))
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View>
      {isLoading ? <ActivityIndicator/> : (
          <View>
          </View>
      )}
    </View>
  );
}