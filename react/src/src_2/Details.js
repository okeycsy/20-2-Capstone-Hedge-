import React, { Component } from 'react';
import { 
    View,
    Text, 
    Button, 
    TouchableOpacity,
    StyleSheet,
    TextInput
 } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onChange } from 'react-native-reanimated';


class Signal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name:'카카오', sig:0.9},
        {name:'삼성전자', sig:0.6},
        {name:'카카오게임즈', sig:0.3},
        {name:'넷마블', sig:-0.2},
        {name:'네이버', sig:0.0},
        {name:'메드팩토', sig:-0.123},
        {name:'test1', sig:-0.34234},
        {name:'test2', sig:-0.56456456456},
        {name:'test3', sig:0.12312},
        {name:'test4', sig:-0.9},
      ],
      favorite: [],
      text: ""
    };
  }

  componentDidMount(){
    // fetch code
    this.init_color();
    this.init_favorite();
  }


  init_color() {
    let data = JSON.parse(JSON.stringify(this.state.data));
    for(let i = 0; i < data.length; i++){
      if(data[i].sig == 0) data[i].color = '#f2f2f2';
      else if(data[i].sig > 0){
        if(data[i].sig > 0.8) data[i].color = '#fd6a6a';
        else if(data[i].sig > 0.5) data[i].color = '#fea2a2';
        else data[i].color = '#fee3e3';
      }
      else if(data[i].sig < 0) {
        if(data[i].sig > -0.3) data[i].color = '#d9eeef';
        else if(data[i].sig > -0.5) data[i].color = '#b8dfe2';
        else data[i].color = '#83c7cc';
      }
    }


    data.sort(function(a, b) {
      return a.sig < b.sig ? 1: a.sig > b.sig ? -1 : 0;
    });
    this.setState({data : data})
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
            favorite: this.state.favorite.concat({name:names[i], sig:this.state.data[i].sig, color:this.state.data[i].color})
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
          favorite: this.state.favorite.concat({name:item.name, sig:item.sig, color:item.color})
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
  search() {
    let text = this.state.text;
    let data = JSON.parse(JSON.stringify(this.state.data));
    let searched_data = [];

    
    for(let i = 0; i < data.length; i++){
      if(data[i].name.indexOf(text) != -1){
        searched_data.push(data[i]);
      }
    }
    
    for(let i = 0; i < searched_data.length; i++){
      let idx = data.indexOf(searched_data[i]);
      if(idx == -1) continue;
      data.splice(idx, 1);
    }

    data = searched_data.concat(data);
    this.setState({data : data});
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.roundContainer1}>
          <Text style={styles.title}>즐겨찾기</Text>
          <View style={styles.button_container}>
            <Button title='high sig sort' onPress={() => this.sort_favorite(1)}></Button>
            <Button title='low sig sort' onPress={() => this.sort_favorite(-1)}></Button>
          </View>
          <FlatList style={styles.flatlist}
              data={this.state.favorite}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.item, {backgroundColor: item.color}]}
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
        </View>  
        
        <View style={styles.roundContainer2}>
          <Text style={styles.title}>전체 목록</Text>

          <View style={{flexDirection:'row', marginBottom:'1%'}}>
            <TextInput 
              style={styles.textinput} 
              onChangeText={(text) => this.setState({text : text})}
              value={this.state.text}
            />
            <Button title='search' onPress={() => this.search()}></Button>
          </View>

          <View style={styles.button_container}>
            <Button title='high sig sort' onPress={() => this.sort_data(1)}></Button>
            <Button title='low sig sort' onPress={() => this.sort_data(-1)}></Button>
          </View>
          <FlatList style={styles.flatlist}
              data={this.state.data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, {backgroundColor: item.color}]}
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
    marginTop: '1%',
    marginBottom: '5%',
    paddingHorizontal: 10,
  },
  flatlist: {
    width: '90%',
    height: '50%'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 5
  },
  text : {
    color: 'black',
    marginLeft: '5%',
    marginBottom: '1%',
    textAlignVertical: 'center'
  },
  button: {
    marginRight: '10%',
    paddingRight: '10%'
  },
  title: {
    fontWeight: "bold",
    marginBottom: "1%",
    marginTop: "5%",
    marginBottom: "1%"
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textinput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: "5%",
    marginTop: "5%"
  },
  roundContainer1: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    height: '30%',
    marginVertical: '3%',
  },
  roundContainer2: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    height: '70%',
  },
});

export default Signal;