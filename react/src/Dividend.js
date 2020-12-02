import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Linking } from 'react-native'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

async function openLink(code) {
  try {
    const url = 'https://finance.naver.com/item/main.nhn?code='
    console.log(InAppBrowser.isAvailable())
    // {
    //   const result =  InAppBrowser.open(url, {

    //     // Android Properties
    //     showTitle: true,
    //     toolbarColor: '#6200EE',
    //     secondaryToolbarColor: 'black',
    //     enableUrlBarHiding: true,
    //     enableDefaultShare: true,
    //     forceCloseOnRedirection: false,
    //     headers: {
    //       'my-custom-header': 'my custom header value'
    //     }
    //   })
    // }
    Linking.openURL(url + code)
  } catch (error) {
    alert(error.message)
  }
}

function DividendDetails( {route} ) {
  const data = route.params
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>{data.name}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            openLink(data.code)
        }}>
          <Text style= {styles.text}>네이버 금융 링크</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.table}>
        <View style={styles.item_set}>
          <View style={styles.item_gray}>
            <Text style={styles.textRight}>어제 종가</Text>
          </View>
          <View style={styles.item_white}>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textRight}>{parseInt(data.cost)} 원</Text>
            </View>
          </View>
        </View>
        <View style={styles.item_set}>
          <View style={styles.item_gray}>
            <View style={styles.rowItem}>
              <Text style= {styles.smallText}>(2019년 배당금 총합 기준)</Text>
              <Text style={styles.textRight}>연간 수익률</Text>
            </View>
          </View>
          <View style={styles.item_white}>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textRight}>{data.yield} %</Text>
            </View>
          </View>
        </View>
        <View style={styles.item_set}>
          <View style={styles.item_gray}>
            <Text style={styles.textRight}>종목 변동성</Text>
          </View>
          <View style={styles.item_white}>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textRight}>{data.risk} %</Text>
            </View>
          </View>
        </View>
        <View style={styles.item_set}>
          <View style={styles.item_gray}>
            <Text style={styles.textRight}>2019년 배당금</Text>
          </View>
          <View style={styles.item_white}>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textRight}>{data.this_year} 원</Text>
            </View>
          </View>
        </View>
        <View style={styles.item_set}>
          <View style={styles.item_gray}>
            <Text style={styles.textRight}>2018년 배당금</Text>
          </View>
          <View style={styles.item_white}>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textRight}>{data.last_year} 원</Text>
            </View>
          </View>
        </View>
        <View style={styles.item_set}>
          <View style={styles.item_gray}>
            <Text style={styles.textRight}>2017년 배당금</Text>
          </View>
          <View style={styles.item_white}>
            <View style={styles.rowSeparator_gray}>
              <Text style={styles.textRight}>{data.lastlast_year} 원</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '80%',
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
  },
  rowName: {
    borderColor: 'white',
    justifyContent: 'space-around',
    alignContent: 'space-between',
  },
  rowItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end'
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
  item_set: {
    width: '100%',
  },
  text: {
    fontSize: 13,
  },
  smallText: {
    fontSize: 12,
    color: 'gray',
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

export default DividendDetails;