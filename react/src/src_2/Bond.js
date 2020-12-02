import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { first } from 'react-stockcharts/lib/utils';
import { Background } from 'victory-native';

export default function Bond() {
  const us = '#cccccc';
  const s = '#9be0ae';

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [idx, setIdx] = useState(0);
  const [buttonColor, setColor] = useState([s, us, us, us, us, us, us]);

  // data[0,1,2,3,4,5,6] = 1,3,5,10,30,aa,bbb
  useEffect(() => {
    Promise.all([
        fetch('http://swlab.uos.ac.kr/BOND_1').then(res => res.json()),
        fetch('http://swlab.uos.ac.kr/BOND_3').then(res => res.json()),
        fetch('http://swlab.uos.ac.kr/BOND_5').then(res => res.json()),
        fetch('http://swlab.uos.ac.kr/BOND_10').then(res => res.json()),
        fetch('http://swlab.uos.ac.kr/BOND_30').then(res => res.json()),
        fetch('http://swlab.uos.ac.kr/BOND_aa').then(res => res.json()),
        fetch('http://swlab.uos.ac.kr/BOND_bbb').then(res => res.json())
    ])
    .then(function(val){
        let data = [];
        for(let i = 0; i < val.length; i++){
            for(let j = 0; j < val[i].length; j++){
                let temp_string = ""
                temp_string += val[i][j].날짜.substring(0,4) + '-';
                temp_string += val[i][j].날짜.substring(4,6) + '-';
                temp_string += val[i][j].날짜.substring(6,8);

                val[i][j].날짜 = temp_string;
            }
            data.push(val[i]);
        } 
        setData(data);
    })
    .catch((error) => alert(error))
    .finally(() => setLoading(false));
  }, []);

  const renderItem = ({item}) => {
      return (
        <TouchableOpacity style={styles.item}>
            <Text>{item.날짜}</Text>
            <View style={{width:'10%'}}><Text>{item.금리}</Text></View>
        </TouchableOpacity>
    )}

  const setClick = (idx) => {
    let color = [us, us, us, us, us, us, us];
    color[idx] = s;
    setColor(color);
  }
  return (
    <View style={{marginTop: '5%'}}>
      {isLoading ? <ActivityIndicator/> : (
          <View>
              <View style={styles.buttonContainer}>
                  
                  <View style={styles.buttonSubContainer}>
                    <Text>국채</Text>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[0]}]} onPress={() => {setIdx(0), setClick(0)}}><Text>1년물</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[1]}]} onPress={() => {setIdx(1), setClick(1)}}><Text>3년물</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[2]}]} onPress={() => {setIdx(2), setClick(2)}}><Text>5년물</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[3]}]} onPress={() => {setIdx(3), setClick(3)}}><Text>10년물</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[4]}]} onPress={() => {setIdx(4), setClick(4)}}><Text>30년물</Text></TouchableOpacity>
                  </View>

                  <View style={styles.buttonSubContainer}>
                    <Text>회사채</Text>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[5]}]} onPress={() => {setIdx(5), setClick(5)}}><Text>aa</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor[6]}]} onPress={() => {setIdx(6), setClick(6)}}><Text>bbb</Text></TouchableOpacity>
                  </View>
              </View>

              <View style={styles.itemContainer}>
                  <FlatList
                    ListHeaderComponent={
                        <View style={styles.header}>
                        <Text>날짜</Text>
                        <Text>금리 (%)</Text>
                        </View>
                    }
                    data={data[idx]}
                    renderItem={renderItem}
                    keyExtractor={item => item.날짜}
                  />
              </View>
          </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
      borderColor: 'lightgray',
      borderRadius: 5,
      borderWidth: 1,
      height: '85%',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 5,
  },
  buttonContainer:{
    flexDirection: 'column',
    flex:1,
    marginVertical: '3%',
    marginBottom: '15%'
  },
  buttonSubContainer:{
    flexDirection: 'row',
    flex:1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: '3%',
  },
  button:{
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  header: {flex:1, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white'}
});