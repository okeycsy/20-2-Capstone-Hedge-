import React, { useEffect, useState } from 'react';
import { Image, ScrollView , Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import Test from './Test'

export default function about_Hedger() {
  return (
    <ScrollView>        
        <Test/>
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