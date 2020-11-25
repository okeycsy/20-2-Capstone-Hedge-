import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from "./src/Home";
import DetailsScreen from "./src/Dividend";

const Stack = createStackNavigator();

function App() {
  const DATA = [
    {
      id: '1',
      type: '유형351',
      title: '이름~~~!@#',
      signal: '매수신234호',
    },
    {
      id: '2',
      type: '유형1',
      title: '이름',
      signal: '매수신호',
    },
    {
      id: '3',
      type: '유형1',
      title: '이름',
      signal: '매수신호',
    },
    {
      id: '4',
      type: '유형1',
      title: '이름',
      signal: '매수신호',
    },
    
  ];

  const Item = ({ data }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title}>{data.type}</Text>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.title}>{data.signal}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => <Item data={item} />;

  return (
	<NavigationContainer>
		<View style={styles.container}>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Details" component={DetailsScreen} />
			</Stack.Navigator>
		</View>
	</NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  rowContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hotProductList: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16
  },
  button: {
    margin: 30,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '30%',
    height: '100%',
  },
});

export default App;