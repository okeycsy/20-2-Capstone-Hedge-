import { NavigationRouteContext } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function DepositDetails( {route} ) {
  const [data, setData] = useState([
    {
      
    }
  ])

  useEffect(() => {
    fetch('http://swlab.uos.ac.kr/sav_' + route.params.fin_prdt_cd + '&' + route.params.bank)
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => alert(error))
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <FlatList style={styles.flatlist}
          ListHeaderComponent = {
            <View>
              <View style={styles.head}>
                <View>
                  <Text style={styles.title}>{data[0].은행명}</Text>
                  <Text style={styles.textLeft}>{data[0].상품명}</Text>
                </View>
                <Text style= {styles.text}>네이버 금융 링크</Text>
              </View>
              <View style={styles.item_set}>
                  <View style={styles.item_gray}>
                    <Text style={styles.textRight}>BIS 자기자본비율</Text>
                  </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{data[0]["BIS 비율"]} %</Text>
                  </View>
                </View>
              </View>
              <View style={styles.item_set}>
                <View style={styles.item_gray}>
                  <Text style={styles.textRight}>고정이하여신비율</Text>
                </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{data[0].고정이하여신비율} %</Text>
                  </View>
                </View>
              </View>
              <View style={styles.item_set}>
                <View style={styles.item_gray}>
                  <Text style={styles.textRight}>가입 대상</Text>
                </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{(data[0].join_member == NaN) ? "없음" : data[0].join_member} </Text>
                  </View>
                </View>
              </View>
                <View style={styles.item_set}>
                  <View style={styles.item_gray}>
                    <Text style={styles.textRight}>우대 조건</Text>
                  </View>
                  <View style={styles.item_white}>
                    <View style={styles.rowSeparator_gray}>
                      <Text style={styles.textRight}>{(data[0].spcl_cnd == "") ? "없음" : data[0].spcl_cnd} </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.item_set}>
                  <View style={styles.item_gray}>
                    <Text style={styles.textRight}>납입 한도</Text>
                  </View>
                  <View style={styles.item_white}>
                    <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{(data[0].max_limit == "") ? "없음" : data[0].max_limit }</Text>
                    </View>
                  </View>
                </View>
              <View style={styles.rowSeparator_white}/>
              <View style={styles.rowSeparator_white}/>
              <View style={styles.rowSeparator_white}/>
              <View style={styles.rowSeparator_white}/>
              <View style={styles.rowSeparator_white}/>
            </View>
          }
          ItemSeparatorComponent={
            ({highlighted}) => (
              <View>
                <View style={styles.rowSeparator_white}/>
                <View style={styles.rowSeparator_white}/>
                <View style={styles.rowSeparator_white}/>
                <View style={styles.rowSeparator_white}/>
                <View style={styles.rowSeparator_white}/>
              </View>
            )
          }
          data={data}
          renderItem={({ item }) => (
            <View style={styles.list_set}>
              <View style={styles.item_set}>
                <View style={styles.item_gray}>
                  <Text style={styles.textRight}>만기</Text>
                </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{item.만기} 개월</Text>
                  </View>
                </View>
              </View>

              <View style={styles.item_set}>
                <View style={styles.item_gray}>
                  <Text style={styles.textRight}>금리 종류</Text>
                </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{item.금리종류}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.item_set}>
                <View style={styles.item_gray}>
                  <Text style={styles.textRight}>기본 금리</Text>
                </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{item.수익률} %</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.item_set}>
                <View style={styles.item_gray}>
                  <View style={styles.rowItem}>
                    <Text style= {styles.smallText}>(우대 조건 모두 만족 시)</Text>
                    <Text style={styles.textRight}>최대 금리</Text>
                  </View>
                </View>
                <View style={styles.item_white}>
                  <View style={styles.rowSeparator_gray}>
                    <Text style={styles.textRight}>{item.최대금리} %</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.field1}
          />
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
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
  },
  list_set: {
    borderColor: 'black',
    borderWidth: 2,
  },
  text: {
    fontSize: 13,
  },
  smallText: {
    fontSize: 10,
    color: 'gray',
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
  }
});

export default DepositDetails;