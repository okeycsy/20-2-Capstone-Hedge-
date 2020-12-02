import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function Macro() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [names, setNames] = useState([]);
  const [tempData, setTemp] = useState([]);

  // field1: 자기 자신
  // NASDAQ. DOW JONES, KOSPI, Gold, CRUDE OIL, USD/KRW, 미 10년 국고채, 미 30년 국고채, 비트코인
  useEffect(() => {
    fetch('http://swlab.uos.ac.kr/api_macro_coef')
      .then((response) => response.json())
      .then(function(result) {
          let keys = Object.keys(result[0]);
          let names = [];
          for(let i = 1; i < keys.length; i++) names.push({name: keys[i], id: i-1});
          setNames(names);
          
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

  const renderNames = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.names}  
        onPress={() => setIdx(item.id)}
      >
          <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  const setIdx = (idx) => {
    let k = [0,1,2,3,4,5,6,7,8];
    k.splice(k.indexOf(idx), 1);
    let temp_data = [];
    for(let i = 0; i < k.length; i++){
        temp_data.push( {name: names[k[i]].name, val: data[idx][names[k[i]].name], id:i} )
    }
    setTemp(temp_data);
  }

  const renderItem = ({item}) => {
      return (
        <TouchableOpacity style={styles.item}>
            <Text>{item.name}</Text>
            <Text>{item.val}</Text>
        </TouchableOpacity>
      )
  }
  return (
    <View>
      {isLoading ? <ActivityIndicator/> : (
          <View style={{flexDirection:'column'}}>
              <View style={styles.namesContainer}>
                <FlatList
                  style={styles.namesFlat}
                  data={names}
                  renderItem={renderNames}
                  numColumns={3}
                  keyExtractor={item => item.id}
                />
              </View>

              <View style={styles.itemContainer}>
                <FlatList
                  style={styles.itemFlat}
                  data={tempData}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    namesContainer: {
        borderWidth:1
    },
    namesFlat: {
        
    },
    names: {

    },

    itemContainer: {
        borderWidth:1
    },
    itemFlat: {
        flexDirection: 'column'
    },
    item: {
        flexDirection: 'row'
    }
})