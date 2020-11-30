import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet, Button, Image } from "react-native";

const Test = () => {
  const [contents, setContents] = useState(0);

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

  const show_contents_1 = () => {
    Animated.sequence([
      fadeIn(fadeAnim),
      fadeIn(test),
      // Animated.parallel([
      //   fadeOut(fadeAnim),
      //   fadeOut(test)
      // ])
    ]).start();
  }

  useEffect(() => {
    show_contents_1();
  });
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {opacity: fadeAnim}
        ]}
      >
        <Image
          style={{ width: 200, height: 200}}
          source={require('../../image/logo.png')}
        />
      </Animated.View>


      <Animated.View
        style={[
          styles.fadingContainer,
          {opacity: test}
        ]}
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