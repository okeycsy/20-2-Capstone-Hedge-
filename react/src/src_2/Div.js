import { func } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function Div({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState(1);
  const [text, setText] = useState("");
  const [search, setSearch] = useState([]);
  const [searchSort, setSearchSort] = useState(1);
  
  // 버튼 색 정의
  const s_h = 'red';
  const s_l = 'blue';
  const us = 'lightgray';
  // 버튼 색 변화를 위한 상태 정의 
  const [sortButtonColor, setSortButtonColor] = useState([us, s_h]);

  useEffect(() => {
    fetch('http://swlab.uos.ac.kr/api_div')
      .then((response) => response.json())
      .then(function(result){
        for(let i = 0; i < result.length; i++) {
          result[i].위험도 = parseFloat(parseFloat(result[i].위험도).toFixed(3))
          result[i].수익률 = parseFloat(parseFloat(result[i].수익률).toFixed(3))
        }
        return result
      })
      .then((result) => setData(result))
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  }, []);

  function fixCode(code) {
    var result = code
    while(result.length < 8) {
      result = '0' + result;
    }
    return result.substr(0, 6);
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.push('Dividend_details',{
          code: fixCode(item.code),
          name: item.회사명,
          this_year: item.올해배당금,
          last_year: item.작년배당금,
          lastlast_year: item.재작년배당금,
          cost: item.주가,
          yield: item.수익률,
          risk: item.위험도
          })}>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{item.회사명}</Text></View>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{item.위험도}</Text></View>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{item.수익률}</Text></View>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{parseInt(item.주가)}</Text></View>
      </TouchableOpacity>
    )
  }

  // 1: 수익률 high, -1: 수익률 low, 2: 리스크 high, -2: 리스크 low
  const sorting = (n) => {
    let nextSort = -1 * n * sort/Math.abs(sort);
    setSort(nextSort);

    let temp_data = JSON.parse(JSON.stringify(data));
    let k;
    if(nextSort > 0) k = [1, -1, 0];
    else k = [-1, 1, 0];

    if( Math.abs(nextSort) === 1 ) {
      temp_data.sort(function(a, b) {
        return a.수익률 < b.수익률 ? k[0] : a.수익률 > b.수익률 ? k[1] : k[2];
      })
    } else {
      temp_data.sort(function(a, b) {
        return a.위험도 < b.위험도 ? k[0] : a.위험도 > b.위험도 ? k[1] : k[2];
      })
    }

    // 버튼 색 변화
    if(nextSort === 1) {
      setSortButtonColor([us, s_h]);
    } else if(nextSort === -1) {
      setSortButtonColor([us, s_l]);
    } else if(nextSort === 2) {
      setSortButtonColor([s_h, us]);
    } else if(nextSort === -2) {
      setSortButtonColor([s_l, us]);
    }

    setData(temp_data);
  }
  
  const searchSorting = (n) => {
    let nextSort = -1 * n * searchSort/Math.abs(searchSort);
    setSearchSort(nextSort);

    let temp_data = JSON.parse(JSON.stringify(search));
    let k;
    if(nextSort > 0) k = [1, -1, 0];
    else k = [-1, 1, 0];

    if( Math.abs(nextSort) === 1 ) {
      temp_data.sort(function(a, b) {
        return a.수익률 < b.수익률 ? k[0] : a.수익률 > b.수익률 ? k[1] : k[2];
      })
    } else {
      temp_data.sort(function(a, b) {
        return a.위험도 < b.위험도 ? k[0] : a.위험도 > b.위험도 ? k[1] : k[2];
      })
    }

    setSearch(temp_data);
  }

  const handle_text = (text) => {
    setText(text);
    let searched_data = [];

    for(let i = 0; i < data.length; i++) {
      if( data[i].회사명.indexOf(text) != -1 ) searched_data.push(data[i]);
    }

    setSearch(searched_data);
  }

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <View style={styles.roundContainer1}>
          <View style={{marginBottom: '2%', flex:1, width: '55%'}}>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => handle_text(text)}
              value={text}
            />
          </View>

          {text === "" ?
            (
              <View style={styles.roundContainer2}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', marginVertical: '2%'}}>
                  <TouchableOpacity onPress={() => sorting(2)} style={[styles.button, {backgroundColor:sortButtonColor[0]}]}><Text style={styles.text}>리스크 정렬</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => sorting(1)} style={[styles.button, {backgroundColor:sortButtonColor[1]}]}><Text style={styles.text}>수익률 정렬</Text></TouchableOpacity>
                </View>
                <View
                  style={styles.columns}>
                  <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>회사명</Text></View>
                  <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>변동성</Text></View>
                  <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>배당 수익률</Text></View>
                  <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>전일 종가</Text></View>
                </View>
                <FlatList
                  style={styles.flatlistlist}
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.회사명}
                />
              </View>
            ) :
            (<View style={styles.roundContainer2}>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', marginVertical: '2%'}}>
                <TouchableOpacity onPress={() => searchSorting(2)} style={[styles.button, {backgroundColor:sortButtonColor[0]}]}><Text style={styles.text}>리스크 정렬</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => searchSorting(1)} style={[styles.button, {backgroundColor:sortButtonColor[1]}]}><Text style={styles.text}>수익률 정렬</Text></TouchableOpacity>
              </View>
              <FlatList
                style={styles.flatlistlist}
                data={search}
                renderItem={renderItem}
                keyExtractor={item => item.회사명}
              />
            </View>)
          }
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
    marginTop: '1%',
    marginBottom: '5%',
    paddingHorizontal: 10,
  },
  flatlist: {
    flexDirection:'column',
    width: '100%',
    height: '50%'
  },
  opacity: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roundContainer1: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: '90%',
  },
  roundContainer2: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    height: '90%',
  },
  textinput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: "5%",
    marginTop: "5%",
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 5,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: '3%',
    height: '5%'
  },
  text : {
    color: 'black',
    marginLeft: '5%',
    marginVertical: '2%',
    textAlignVertical: 'center',
    fontSize: 12,
  },
  button: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    width: '35%',
    height:'100%',
    alignItems: 'center'
  }
});