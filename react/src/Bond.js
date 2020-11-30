import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const TEMP1 = [
    {
      id: '1',
      type: '5년',
      thisTerm: '1.057',
    },
  ];
  const Item = ({ data }) => (
    <View style={((data.id % 2 == 0) ? (styles.item_white) : (styles.item_gray))}>
      <View style={((data.id % 2 == 0) ? (styles.rowSeparator_gray) : (styles.rowSeparator_white))}>
        <Text style={styles.textRight}>{data.type}</Text>
      </View>
      <View style={((data.id % 2 == 0) ? (styles.rowSeparator_gray) : (styles.rowSeparator_white))}>
        <Text style={styles.textRight}>{data.thisTerm}</Text>
      </View>
    </View>
  );

  const renderItem = ({item}) => <Item data={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>국채 1년물</Text>
        <Text style= {styles.text}>채권 관련 링크</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.rowName}>
          <View style={styles.item_gray}>
            <View style={styles.rowSeparator_white}>
              <Text style={styles.textCenter}>만기</Text>
            </View>
            <View style={styles.rowSeparator_white}>
              <Text style={styles.textCenter}>수익률</Text>
            </View>
          </View>
        </View>
        <FlatList data={TEMP1} renderItem={renderItem} keyExtractor={item => item.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
  },
  head: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 20,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 26,
  },
  table: {
    borderColor: 'lightgray',
    borderWidth: 2,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  rowName: {
    borderColor: 'white',
    justifyContent: 'space-around',
    alignContent: 'space-between',
  },
  rowSeparator_white: {
    borderColor: 'white',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  rowSeparator_gray: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  item_gray: {
    backgroundColor: 'lightgray',
    padding: 10,
    justifyContent: 'space-between',
  },
  item_white: {
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 13,
  },
  textCenter: {
    fontSize: 16,
    textAlign: 'center',
  },
  textRight: {
    fontSize: 16,
    textAlign: 'right',
  }
});

export default App;