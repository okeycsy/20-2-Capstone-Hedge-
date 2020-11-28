import React, { useEffect, useState } from 'react';
import { Image, ScrollView , Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default function about_Hedger() {
  return (
    <ScrollView
        contentContainerStyle={styles.contentContainer}
    >
        <View style={styles.subContainer}>
            <Image
            style={{ width: 600, height: 300}}
            source={require('../../image/소개_1.png')}
            />
        </View>

        <View style={styles.subContainer}>
            <Image
            style={{ width: 600, height: 300}}
            source={require('../../image/소개_2.png')}
            />
        </View>

        <View style={styles.subContainer}>
            <Image
            style={{ width: 600, height: 300}}
            source={require('../../image/소개_3.png')}
            />
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    subContainer: {
        margin: 10
    }
})