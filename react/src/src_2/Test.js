import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";

const Test = () => {
  const [page, setPage] = useState(1);
  const Contents_1 = [
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png') },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png') },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png') },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/logo.png') },
  ];
  const Contents_2 = [
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/seok1.jpg'), name:"최석용", text:"- Team Leader\n -Developed Part : BackEnd(Server, DB, Data Collecting)" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/seung1.jpg'), name:"이승윤", text:" -Developed Part : BackEnd(Server, Data Collecting" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/jun1.jpg'), name:"이정준", text:" -Developed Part : FrontEnd(React Native), Data Collecting" },
    { ani: useRef(new Animated.Value(0)).current, img: require('../../image/jung1.jpg'), name:"정현학", text:" -Developed Part : FrontEnd(React Native), Data Collecting" },
  ];

  const fadeIn = (target) => {
    return Animated.timing( target, {toValue: 1, duration: 300} )
  };
  const fadeOut = (target) => {
    return Animated.timing( target, {toValue: 0, duration: 300} )
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
        <Image
          style={styles.Contents_img}
          source={item.img}
        />
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
        <TouchableOpacity style={styles.button} onPress={() => display_contents(Contents_2, Contents_1)}><Text>Contents_2</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => display_contents(Contents_1, Contents_2)}><Text>Contents_1</Text></TouchableOpacity>
        
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
    flex: 1
  },
  button: {
    borderWidth: 1
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