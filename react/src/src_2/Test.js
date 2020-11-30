import React, { useRef } from "react";
import { Animated, Text, View, StyleSheet, Button } from "react-native";

const Test = () => {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = (target) => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(target, {
      toValue: 1,
      duration: 500
    }).start();
  };

  const fadeOut = (target) => {
    // Will change fadeAnim value to 0 in 5 seconds
    Animated.timing(target, {
      toValue: 0,
      duration: 500
    }).start();
  };

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
        <Text style={styles.fadingText}>Fading View!</Text>
      </Animated.View>
      <View style={styles.buttonRow}>
        <Button title="Fade In" onPress={() => fadeIn(fadeAnim)} />
        <Button title="Fade Out" onPress={() => fadeOut(fadeAnim)} />
      </View>
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