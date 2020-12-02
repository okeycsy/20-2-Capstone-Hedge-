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
import StockScreen from "./src/src_2/Details";
import Stock_Details from "./src/src_2/Stock_Details";
import about_Hedger from "./src/src_2/about_Hedger";
import Div from "./src/src_2/Div";
import Macro from "./src/src_2/Macro";
import DividendDetails from "./src/Dividend"
import Dep from "./src/src_2/Dep"
import DepositDetails from "./src/Deposit"
import Sav from "./src/src_2/Sav"
import SavingDetails from "./src/Saving"
import ELSDLS from "./src/src_2/ELSDLS"
import Bond from "./src/src_2/Bond"

const Stack = createStackNavigator();

function App() {
  return (
	<NavigationContainer>
		<View style={styles.container}>
			<Stack.Navigator initialRouteName="Home">
				<Stack.Screen name="Home" component={HomeScreen} options={({  }) => ({ title: 'Home' })}/>
				<Stack.Screen name="Stocks" component={StockScreen} options={({  }) => ({ title: '주식신호분석' })}/>
        <Stack.Screen name="Stock_Details" component={Stock_Details} options={({ route }) => ({ title: route.params.name })}/>
        <Stack.Screen name="about_Hedger" component={about_Hedger} options={({  }) => ({ title: 'About Hedger' })}/>
        <Stack.Screen name="Div" component={Div} options={({  }) => ({ title: '배당금 한눈에' })}/>
        <Stack.Screen name="Dividend_details" component={DividendDetails} options={({ route }) => ({ title: route.params.name })}/>
        <Stack.Screen name="Dep" component={Dep} options={({  }) => ({ title: '예금상품 한눈에' })}/>
        <Stack.Screen name="Deposit_details" component={DepositDetails} options={({ route }) => ({ title: route.params.name })}/>
        <Stack.Screen name="Sav" component={Sav} options={({  }) => ({ title: '적금상품 한눈에' })}/>
        <Stack.Screen name="Saving_details" component={SavingDetails} options={({ route }) => ({ title: route.params.name })}/>
        <Stack.Screen name="ELSDLS" component={ELSDLS} options={({  }) => ({ title: 'ELS/DLS 한눈에' })}/>
        <Stack.Screen name="Macro" component={Macro} options={({  }) => ({ title: '매크로분석 한눈에' })}/>
        <Stack.Screen name="Bond" component={Bond} options={({  }) => ({ title: '채권 한눈에' })}/>
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