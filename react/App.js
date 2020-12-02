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
import DetailsScreen from "./src/new_ProductChart";
import StockScreen from "./src/src_2/Details";
import Stock_Details from "./src/src_2/Stock_Details";
import about_Hedger from "./src/src_2/about_Hedger";
import Div from "./src/src_2/Div";
import DividendDetails from "./src/Dividend"

const Stack = createStackNavigator();

function App() {
  return (
	<NavigationContainer>
		<View style={styles.container}>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Details" component={DetailsScreen} />
				<Stack.Screen name="Stocks" component={StockScreen} />
        <Stack.Screen name="Stock_Details" component={Stock_Details} />
        <Stack.Screen name="about_Hedger" component={about_Hedger} />
        <Stack.Screen name="Div" component={Div} />
        <Stack.Screen name="Dividend_details" component={DividendDetails} />
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