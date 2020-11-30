import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

const Test = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const test = useRef(new Animated.Value(0)).current;

  const fadeIn = (target) => {
    return (
      Animated.timing(target, {
        toValue: 1,
        duration: 500
      }))
  };

  const fadeOut = (target) => {
    return (
    Animated.timing(target, {
      toValue: 0,
      duration: 500
    }))
  };

  const appear_contents_1 = () => {
    Animated.sequence([
      fadeIn(fadeAnim),
      fadeIn(test),
    ]).start();
  }
  const disappear_contents_1 = () => {
    Animated.parallel([
      fadeOut(fadeAnim),
      fadeOut(test)
    ]).start()
  }

  useEffect(() => {
    appear_contents_1();
  });
  
  
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => appear_contents_1()}><Text>Contents_1</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => disappear_contents_1()}><Text>Contents_2</Text></TouchableOpacity>
      </View>

      <Animated.View
        style={[{opacity: fadeAnim}]}
      >
        <Image
          style={{ width: 200, height: 200}}
          source={require('../../image/logo.png')}
        />
      </Animated.View>


      <Animated.View
        style={[{opacity: test}]}
      >
        <Image
          style={{ width: 200, height: 200}}
          source={require('../../image/logo.png')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default Test;