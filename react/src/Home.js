import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

function App({ navigation }) {
  const DATA = [
    {
      id: '1',
      type: '유형351',
      title: '이름~~~!@#',
      signal: '매수신234호',
    },
    {
      id: '2',
      type: '유형1',
      title: '이름',
      signal: '매수신호',
    },
    {
      id: '3',
      type: '유형1',
      title: '이름',
      signal: '매수신호',
    },
    {
      id: '4',
      type: '유형1',
      title: '이름',
      signal: '매수신호',
    },
    
  ];

  const Item = ({ data }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.push('Stock_Details')}
    >
      <Text style={styles.title}>{data.type}</Text>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.title}>{data.signal}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => <Item data={item} />;

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{ width: 200, height: 200}}
          source={require('../image/logo.png')}
        />
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => navigation.push('Stocks')} style={styles.button}>
          <Text>주식 신호분석</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.push('Details')} style={styles.button}>
          <Text>금융상품 비교</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.hotProductList}>
        <FlatList data={DATA} renderItem={renderItem} keyExtractor={item => item.id} />
      </View>

      <View>
        <TouchableOpacity onPress={() => navigation.push('about_Hedger')}>
          <Text>Hedger는 어떤 어플인가요?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0%',
    marginBottom: '5%',
    paddingHorizontal: 10,
  },
  rowContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    width: '85%',
    marginVertical: '3%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hotProductList: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center'
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16
  },
  button: {
    margin: 30,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '30%',
    height: '100%',
  },
});

export default App;