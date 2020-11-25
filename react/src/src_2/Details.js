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


class Signal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name:'test_1', sig:0.99999},
        {name:'test_2', sig:-0.1},
        {name:'test_4', sig:0.01},
        {name:'test_5', sig:0.01},
        {name:'test_6', sig:0.01},
        {name:'test_7', sig:0.01},
        {name:'test_8', sig:0.01},
        {name:'test_9', sig:0.01},
        {name:'test_10', sig:0.01},
        {name:'test_11', sig:0.01},
        {name:'test_12', sig:0.01},
        {name:'test_13', sig:0.01},
        {name:'test_14', sig:0.01},
      ],
      favorite: []
    };
  }

  componentDidMount(){
    // fetch code
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
      <View style={styles.container}>
        
        <Text style={styles.title}>즐겨찾기</Text>
        <FlatList style={styles.flatlist}
            data={this.state.favorite}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>{item.sig}</Text>
                <Button style={styles.button}
                  onPress={() => this.defavorite(item)}
                  title="★"
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
        />

        <Text style={styles.title}>전체 목록</Text>
        <FlatList style={styles.flatlist}
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>{item.sig}</Text>
                <Button style={styles.button}
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
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%'
  },
  flatlist: {
    width: '70%',
    height: '50%'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 5
  },
  text : {
    color: 'black',
    marginLeft: '5%',
    marginTop: '1%',
    marginBottom: '1%'

  },
  button: {
    marginRight: '10%',
  },
  title: {
    fontWeight: "bold",
    marginBottom: "5%"
  }
});

export default Signal;