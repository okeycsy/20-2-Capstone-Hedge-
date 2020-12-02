import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { color } from "react-native-reanimated";

const Test = () => {
  const [c, setC] = useState(['powderblue', '#b9bdc4']);
  const Contents_1 = [
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png'), text:"\n1. 배당금\n\n 배당금을 한눈에 예측할 수 있는 화면입니다.\n주가 변동성과 수익률을 바탕으로 내림차순/오름차순으로 정렬해 직관적인 데이터를 확인할 수 있습니다.\n" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png'), text:"2&3.예/적금상품\n\n 최신 예금상품을 비교할 수 있는 화면입니다.\n각 은행의 'BIS 자기자본비율'과 '고정이하여신비율'을 바탕으로 위험도를 모델링하여 산출하였습니다.\n리스크 정렬과 수익률 정렬으로 보다 직관적인 데이터 확인이 가능합니다\n예금상품의 상세정보를 원할 경우, 클릭하여 가입정보, 우대정보, 납입한도, 만기, 금리종류 등이 들어있는 상세정보를 확인할 수 있습니다.\n" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png'), text:"4. 매크로지표\n\n 대표적인 금융상품인 나스닥, 다우존스, 코스피, 금, 크루드 오일, 원/달러 환율, 미 10년,30년 국고채, 비트코인의 최근 3년 시세를 바탕으로 회귀분석을 진행해 상관계수를 제공합니다.\n상관계수가 1에 가까울수록 같은 방향으로, -1에 가까울수록 반대 방향으로 움직이는 경향을 보입니다.\n"},
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png'), text:"5. 채권\n\n 개인이 투자할 수 있는 국고채와 회사채 정보를 담았습니다.\n국고채 단/장기인 1,3,5,10,30년물과 회사채를 신용등급에 따라 분류한 AA, BBB- 등급의 금리변화를 쉽게 확인할 수 있습니다.\n"},
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png'), text:"6. ELS & DLS\n\n 최근 열흘 내에 발행된 파생결합증권을 확인할 수 있습니다. 발행 증권사와 기초자산, 발행일과 만기일, 최소/최대 이율을 확인할 수 있습니다.\n"},
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png'), text:"7. 주식신호확인\n\n 대표적인 지표인 MACD, Momentum, RSI, Solw Stocastic을 Machine Learning으로 Parameter를 학습하고, Ensemble 기법을 활용하여 지표를 조합해 신호를 파악합니다.\n1에 가까울수록 긍정적, -1에 가까울수록 부정적 요소를 띕니다."},
  ];
  const Contents_2 = [
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/seok1.jpg'), name:"최석용", text:"Team Leader\n\n <Developed Part>\n\n- BackEnd(Server & DB)\n- Data Collecting" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/seung1.jpg'), name:"이승윤", text:" <Developed Part>\n\n- BackEnd(Server)\n- Data Collecting" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/jun1.jpg'), name:"이정준", text:" <Developed Part>\n\n- FrontEnd(React Native)\n- Data Collecting\n- 신호분석" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/jung1.jpg'), name:"정현학", text:" <Developed Part>\n\n- FrontEnd(React Native)\n- Data Collecting" },
  ];

  const fadeIn = (target) => {
    return Animated.timing( target, {toValue: 1, duration: 300, useNativeDriver: true} )
  };
  const fadeOut = (target) => {
    return Animated.timing( target, {toValue: 0, duration: 300, useNativeDriver: true} )
  };

  const appear_contents = (Contents) => {
    return Animated.sequence( Contents.map(x => fadeIn(x.ani)) )
  };
  const disappear_contents = (Contents) => {
    return Animated.parallel( Contents.map(x => fadeOut(x.ani)) )
  };
  const display_contents = (target, detarget) => {
    Animated.sequence([
      disappear_contents(detarget),
      appear_contents(target)
    ]).start();
  }

  useEffect(() => {
    display_contents(Contents_2, Contents_1)
  });
  
  const renderItem_1 = ({ item }) => {
    return (
      <Animated.View style={[{opacity: item.ani}]}>
        <Text>{item.text}</Text>
      </Animated.View>
    )
  }

  const renderItem_2 = ({ item }) => {
    return (
      <Animated.View style={[{opacity: item.ani}]}>
        <View style={{flexDirection:'row', marginVertical: '5%'}}>
          <View style={{marginRight:'5%'}}>
            <Image
              style={styles.Contents_img}
              source={item.img}
            />
          </View>
          <View style={{flex:1, flexDirection:'column', alignItems:'stretch'}}>
            <View><Text style={{fontSize:20}}>{item.name}</Text></View>
            <View><Text>{item.text}</Text></View>
          </View>
        </View>
      </Animated.View>
    )
  }


  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor:c[0]}]} onPress={() => {display_contents(Contents_2, Contents_1), setC(['powderblue', '#b9bdc4'])}}><Text style={{fontSize:20}}>개발자</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:c[1]}]} onPress={() => {display_contents(Contents_1, Contents_2), setC(['#b9bdc4','powderblue'])}}><Text style={{fontSize:20}}>설명서</Text></TouchableOpacity>
        
      </View>

      <View>
        <View style={styles.fixed}>
          <FlatList
              data={Contents_1}
              renderItem={renderItem_1}
          />
        </View>

        <View>
          <FlatList
              data={Contents_2}
              renderItem={renderItem_2}
          />
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: '5%'
  },
  button: {
    borderRadius: 10,
    width: '35%',
    height:'100%',
    alignItems: 'center'
  },
  Contents_img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden'
  },
  fixed: {
    position:'absolute',
    left:0, top:0, bottom:0, right:0
  }
});

export default Test;