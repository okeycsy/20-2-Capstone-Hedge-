import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {readString} from "react-papaparse";

export default function Div() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState(1);
  const [text, setText] = useState("");
  const [search, setSearch] = useState([]);
  const [searchSort, setSearchSort] = useState(1);

  useEffect(() => {
    fetch('http://swlab.uos.ac.kr/api_div')
      .then((response) => response.text())
      .then((text) => readString(text))
      .then((result) => result.data)
      .then(function(result) {
        let temp_data = [];
        for(let i = 1; i < result.length; i++) {
          let temp_obj = {
            idx: result[i][1],
            name: result[i][2],
            yield: result[i][3],
            risk: result[i][4]
          }
          if(temp_obj.name === undefined) continue;
          temp_data.push(temp_obj);
        }

        temp_data.sort(function(a,b) {
          return a.yield < b.yield ? 1 : a.yield > b.yield ? -1 : 0;
        })
        setData(temp_data);
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.opacity}>
        <Text>{item.name}   </Text>
        <Text>{item.risk}   </Text>
        <Text>{item.yield}   </Text>
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
        return a.yield < b.yield ? k[0] : a.yield > b.yield ? k[1] : k[2];
      })
    } else {
      temp_data.sort(function(a, b) {
        return a.risk < b.risk ? k[0] : a.risk > b.risk ? k[1] : k[2];
      })
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
        return a.yield < b.yield ? k[0] : a.yield > b.yield ? k[1] : k[2];
      })
    } else {
      temp_data.sort(function(a, b) {
        return a.risk < b.risk ? k[0] : a.risk > b.risk ? k[1] : k[2];
      })
    }

    setSearch(temp_data);
  }

  const handle_text = (text) => {
    setText(text);
    let searched_data = [];

    for(let i = 0; i < data.length; i++) {
      if( data[i].name.indexOf(text) != -1 ) searched_data.push(data[i]);
    }

    setSearch(searched_data);
  }
  
  // const searching = () => {
  //   let searched_data = [];

  //   for(let i = 0; i < data.length; i++) {
  //     try{
  //       if( data[i].name.indexOf(text) != -1 ) searched_data.push(data[i]);
  //     } catch {
  //     }      
  //   }

  //   setSearch(searched_data);
  // }

  return (
    <View>
      {isLoading ? <ActivityIndicator/> : (
        <View>
          <View>
            <TextInput
              onChangeText={(text) => handle_text(text)}
              value={text}
            />
            {/* <TouchableOpacity onPress={() => searching()}><Text>검색</Text></TouchableOpacity> */}
          </View>

          {text === "" ?
            (<View>
              <View>
                <TouchableOpacity onPress={() => sorting(2)}><Text>리스크 정렬</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => sorting(1)}><Text>수익률 정렬</Text></TouchableOpacity>
              </View>

              <FlatList
                style={styles.flatlistlist}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.idx}
              />
            </View>) :
            (<View>
              <View>
                <TouchableOpacity onPress={() => searchSorting(2)}><Text>리스크 정렬</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => searchSorting(1)}><Text>수익률 정렬</Text></TouchableOpacity>
              </View>

              <FlatList
                style={styles.flatlistlist}
                data={search}
                renderItem={renderItem}
                keyExtractor={item => item.idx}
              />
            </View>)
          }
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flatlist: {
    flexDirection:'column'
  },
  opacity: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});