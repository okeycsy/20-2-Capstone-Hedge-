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
      id: '0',
      join_member: '실명의 개인',
      max_limit: '없음',
      spcl_cnd: '* 최대우대금리 : 0.4%\n1. 거래고객우대금리 : 최대0.1% (신규시) \n -최초예적금고객/재예치/장기거래 각 0.05% \n2. 거래실적우대금리 : 최대0.3% (만기시)\n -급여,연금이체등/수협카드결제/공과금이체등 각0.1%\n※단위:연%p',
      last2Term: '41344569',
    },
    {
      id: '2',
      type: '(연결) 당기순이익 (백만원)',
      thisTerm: '15353323',
      lastTerm: '32815127',
      last2Term: '28800837',
    },
  ];
  const TEMP2 = [
    {
      id: '1',
      type: '주당 현금배당금(원)보통주(1)당기',
      thisTerm: '1416',
      lastTerm: '1416',
      last2Term: '850',
    },
    {
      id: '2',
      type: '주당 현금배당금(원)우선주(1)당기',
      thisTerm: '2077',
      lastTerm: '1417',
      last2Term: '1417',
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
      <View style={((data.id % 2 == 0) ? (styles.rowSeparator_gray) : (styles.rowSeparator_white))}>
        <Text style={styles.textRight}>{data.lastTerm}</Text>
      </View>
      <Text style={styles.textRight}>{data.last2Term}</Text>
    </View>
  );

  const renderItem = ({item}) => <Item data={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={styles.titleSub}>
          <Text style={styles.title}>수협은행</Text>
          <Text style={styles.textLeft}>Sh평생주거래우대예금</Text>
        </View>
        <Text style= {styles.text}>네이버 금융 링크</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.rowName}>
          <View style={styles.item_gray}>
            <View style={styles.rowSeparator_white}>
              <Text style={styles.textCenter}>구분</Text>
            </View>
            <View style={styles.rowSeparator_white}>
              <Text style={styles.textCenter}>당기</Text>
            </View>
            <View style={styles.rowSeparator_white}>
              <Text style={styles.textCenter}>전기</Text>
            </View>
            <Text style={styles.textCenter}>전전기</Text>
          </View>
          <View style={styles.item_white}>
          <View style={styles.rowSeparator_gray}>
              <Text style={styles.textCenter}>구분</Text>
            </View>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textCenter}>당기</Text>
            </View>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textCenter}>전기</Text>
            </View>
            <Text style={styles.textCenter}>전전기</Text>
          </View>
        </View>
        <FlatList data={TEMP1} renderItem={renderItem} keyExtractor={item => item.id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  titleSub: {
    width: '60%',
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
  },
  textLeft: {
    fontSize: 16,
    textAlign: 'left',
  },
});

export default App;