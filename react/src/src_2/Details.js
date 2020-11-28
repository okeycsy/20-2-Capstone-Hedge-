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
import AlternatingFillAreaSeries from 'react-stockcharts/lib/series/AlternatingFillAreaSeries';


class Signal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name:'카카오', sig:0.571},
        {name:'삼성전자', sig:0.624},
        {name:'카카오게임즈', sig:0.001},
        {name:'넷마블', sig:-0.431},
        {name:'네이버', sig:0.001},
        {name:'메드팩토', sig:0.934},
        {name:'넥슨', sig:0.353},
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
  sort_favorite(s) {
    let temp = JSON.parse(JSON.stringify(this.state.favorite));
    let k = [];
    if(s == 1) k = [1,-1,0];
    else k = [-1,1,0];
    temp.sort(function(a, b) {
      return a.sig < b.sig ? k[0]: a.sig > b.sig ? k[1] : k[2];
    });
    this.setState({favorite: temp});
  }
  sort_data(s) {
    let temp = JSON.parse(JSON.stringify(this.state.data));
    let k = [];
    if(s == 1) k = [1,-1,0];
    else k = [-1,1,0];
    temp.sort(function(a, b) {
      return a.sig < b.sig ? k[0]: a.sig > b.sig ? k[1] : k[2];
    });
    this.setState({data: temp});
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>즐겨찾기</Text>
        <View style={styles.button_container}>
          <Button title='high sig sort' style={styles.button} onPress={() => this.sort_favorite(1)}></Button>
          <Button title='low sig sort' style={styles.button} onPress={() => this.sort_favorite(-1)}></Button>
        </View>
        
        <FlatList style={styles.flatlist}
            data={this.state.favorite}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.item}
                onPress={() => navigation.push('Stock_Details')}
              >
                <View style={{flex:1}}><Text style={styles.text}>{item.name}</Text></View>
                <View style={{flex:1}}><Text style={styles.text}>{item.sig}</Text></View>
                <Button style={styles.button}
                  onPress={() => this.defavorite(item)}
                  title="★"
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.name}
        />

        <Text style={styles.title}>전체 목록</Text>
        <View style={styles.button_container}>
          <Button title='high sig sort' style={styles.button} onPress={() => this.sort_data(1)}></Button>
          <Button title='low sig sort' style={styles.button} onPress={() => this.sort_data(-1)}></Button>
        </View>
        <FlatList style={styles.flatlist}
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.push('Stock_Details')}
              >
                <View style={{flex:1}}><Text style={styles.text}>{item.name}</Text></View>
                <View style={{flex:1}}><Text style={styles.text}>{item.sig}</Text></View>
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
    paddingRight: '10%'
  },
  title: {
    fontWeight: "bold",
    marginBottom: "1%"
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }

});

export default Signal;