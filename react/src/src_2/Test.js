import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet, Button, Image } from "react-native";

const Test = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
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

  const start_sequence = () => {
    Animated.sequence([
      fadeIn(fadeAnim),
      fadeIn(test),
      Animated.parallel([
        fadeOut(fadeAnim),
        fadeOut(test)
      ])
    ]).start();
  }

  useEffect(() => {
    start_sequence();
  });
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim // Bind opacity to animated value
          }
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
          {
            opacity: test // Bind opacity to animated value
          }
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  fadingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "powderblue"
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
    margin: 10
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 16
  }
});

export default Test;