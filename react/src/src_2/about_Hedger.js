import React, { useEffect, useState } from 'react';
import { Image, ScrollView , Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import Test from './Test'
import Div from './Div'

export default function about_Hedger() {
  return (
    <ScrollView
        contentContainerStyle={styles.contentContainer}
    >        
        <Div/>
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