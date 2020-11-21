import React, { Component } from 'react';
import { 
    View,
    Text, 
    Button, 
    TouchableOpacity,
    StyleSheet
 } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name:'test_1', sig:0.99999},
        {name:'test_2', sig:-0.1},
        {name:'test_3', sig:0.01}
      ],

      favorite: []
    };
  }

  componentDidMount(){
    this.init_favorite();
  }

  init_favorite() {
    let f;
    try {
      AsyncStorage.getItem('@hedger_favorite').then(val => {
        f = JSON.parse(val);
        if(f === null) return;
        let names = this.state.data.map(data => data.name);
        for(let i = 0; i < f.length; i++) {
          let idx = names.indexOf(f[i]);
          this.setState({
            favorite: this.state.favorite.concat({name:names[i], sig:this.state.data[i].sig})
          });
        }
      });
    } catch(err) {
      alert('init Favorite Error');
    }
  }
  favorite(item) {
    let f;
    try {
      AsyncStorage.getItem('@hedger_favorite').then(val => {
        f = JSON.parse(val);
        if(f === null) f = [];
  
        if(f.indexOf(item.name) != -1) return;
        f.push(item.name);
        AsyncStorage.setItem('@hedger_favorite', JSON.stringify(f));
        this.setState({
          favorite: this.state.favorite.concat({name:item.name, sig:item.sig})
        });
      });
    } catch(error) {
      alert('Favorite Error');
    }
  }
  defavorite(item) {
    let f;
    try {
      AsyncStorage.getItem('@hedger_favorite').then(val => {
        f = JSON.parse(val);
        
        let idx = f.indexOf(item.name);
        f.splice(idx, 1);
        AsyncStorage.setItem('@hedger_favorite', JSON.stringify(f));
        this.setState({
          favorite: this.state.favorite.filter(data => data.name != item.name)
        });
      });
    } catch(error) {
      alert('deFavorite Error');
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <FlatList
            data={this.state.favorite}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <Text>{item.name}</Text>
                <Text>{item.sig}</Text>
                <Button
                  onPress={() => this.defavorite(item)}
                  title="★"
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
        />

        
        <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <Text>{item.name}</Text>
                <Text>{item.sig}</Text>
                <Button
                  onPress={() => this.favorite(item)}
                  title="☆"
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
        />
     </View>
    )
  }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default Details;