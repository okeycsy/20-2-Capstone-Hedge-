import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';

function App({ navigation }) {
  return (
      <View style={styles.container}>
        <View style={{flex:1, height:'10%', marginTop: '3%'}}>
          <Image
            style={{ width: 150, height: 150}}
            source={require('../image/logo.png')}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.subRow}>
            <TouchableOpacity onPress={() => navigation.push('Div')} style={styles.button}>
              <Image
                style={styles.icon}
                source={require('../assets/Dividend.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Dep')} style={styles.button}>
              <Image
                style={styles.icon}
                source={require('../assets/Deposit.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Sav')} style={styles.button}>
              <Image
                style={styles.icon}
                source={require('../assets/Saving.png')}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.subRow}>
            <TouchableOpacity onPress={() => navigation.push('Macro')} style={styles.button}>
              <Image
                style={styles.icon}
                source={require('../assets/Macro.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('Bond')} style={styles.button}>
              <Image
                style={styles.icon}
                source={require('../assets/Bond.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('ELSDLS')} style={styles.button}>
              <Image
                style={styles.icon}
                source={require('../assets/ELS.png')}
              />
            </TouchableOpacity>
          </View>


        </View>

        <View style={{width:'80%', height:'8%', marginVertical: '5%'}}>
          <TouchableOpacity onPress={() => navigation.push('Stocks')}>
            <Image
              style={[styles.icon, {width: '100%', height: '100%'}]}
              source={require('../assets/Stock.png')}
            />
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity 
            style={{marginTop:'3%'}}
            onPress={() => navigation.push('about_Hedger')}
            >
            <Text style={{fontSize:16, backgroundColor: '#eef571'}}>Hedger는 어떤 어플인가요?</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0%',
    marginBottom: '5%',
    paddingHorizontal: 10,
    height: '100%'
  },
  rowContainer: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    height: '60%',
    justifyContent: 'center',
  },
  subRow: {
    width: '100%',
    height: '50%',
    paddingVertical: '7%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    fontSize: 16
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '30%',
    height: '120%',
  },
  icon: {
    borderRadius: 10,
    borderColor: 'lightgray',
    borderWidth: 2,
    width: '120%',
    height: '90%',
    resizeMode: 'contain',
    alignSelf: 'center'
  }
});

export default App;