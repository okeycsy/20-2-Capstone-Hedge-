import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

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
      .then((text) => text.split(','))
      .then(function(result) {
        let temp_data = [];
        for(let i = 6; i < result.length; i+=5) {
          let temp_obj = {
            idx: result[i],
            name: result[i+1],
            yield: parseFloat(result[i+2]).toFixed(3),
            risk: parseFloat(result[i+3]).toFixed(3)
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
      <TouchableOpacity style={styles.item}>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{item.name}</Text></View>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{item.risk}</Text></View>
        <View style={{flex:1, alignItems:'center'}}><Text style={styles.text}>{item.yield}</Text></View>
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
                  <TouchableOpacity onPress={() => sorting(2)} style={styles.button}><Text style={styles.text}>리스크 정렬</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => sorting(1)} style={styles.button}><Text style={styles.text}>수익률 정렬</Text></TouchableOpacity>
                </View>
                <FlatList
                  style={styles.flatlistlist}
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.idx}
                />
              </View>
            ) :
            (<View style={styles.roundContainer2}>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', marginVertical: '2%'}}>
                <TouchableOpacity onPress={() => searchSorting(2)} style={styles.button}><Text style={styles.text}>리스크 정렬</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => searchSorting(1)} style={styles.button}><Text style={styles.text}>수익률 정렬</Text></TouchableOpacity>
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
    width: '85%',
    height: '90%',
  },
  roundContainer2: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '60%',
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
  text : {
    color: 'black',
    marginLeft: '5%',
    marginVertical: '2%',
    textAlignVertical: 'center',
    fontSize: 16,
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