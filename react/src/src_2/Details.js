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
      data: [],
      favorite: [],
      text: "",
      searched_data: []
    };
  }

  componentDidMount(){
    const that = this;
    fetch('http://swlab.uos.ac.kr/bs')
    .then((response) => (response.json()))
    .then(function(result){
      for(let i = 0; i < result.length; i++) result[i].bs = parseFloat(result[i].bs);
      that.setState({data:result})
    })
    .then(function(){
      that.init_color();
      that.init_favorite();
    })
    .catch(err => alert(err))
  }


  init_color() {
    let data = JSON.parse(JSON.stringify(this.state.data));
    for(let i = 0; i < data.length; i++){
      if(data[i].bs == 0) data[i].color = '#f2f2f2';
      else if(data[i].bs > 0){
        if(data[i].bs > 0.8) data[i].color = '#fd6a6a';
        else if(data[i].bs > 0.5) data[i].color = '#fea2a2';
        else data[i].color = '#fee3e3';
      }
      else if(data[i].bs < 0) {
        if(data[i].bs > -0.3) data[i].color = '#d9eeef';
        else if(data[i].bs > -0.5) data[i].color = '#b8dfe2';
        else data[i].color = '#83c7cc';
      }
    }


    data.sort(function(a, b) {
      return a.bs < b.bs ? 1: a.bs > b.bs ? -1 : 0;
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
            favorite: this.state.favorite.concat({name:names[i], bs:this.state.data[i].bs, color:this.state.data[i].color})
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
          favorite: this.state.favorite.concat({name:item.name, bs:item.bs, color:item.color})
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
      return a.bs < b.bs ? k[0]: a.bs > b.bs ? k[1] : k[2];
    });
    this.setState({favorite: temp});
  }
  sort_data(s) {
    let temp;
    if(this.state.text == "") temp = JSON.parse(JSON.stringify(this.state.data));
    else temp = JSON.parse(JSON.stringify(this.state.searched_data));

    let k = [];
    if(s == 1) k = [1,-1,0];
    else k = [-1,1,0];
    temp.sort(function(a, b) {
      return a.bs < b.bs ? k[0]: a.bs > b.bs ? k[1] : k[2];
    });
    
    if(this.state.text == "") this.setState({data: temp});
    else this.setState({searched_data:temp});
  }

  handle_text(text) {
    this.setState({text:text});
    let searched_data = [];
    let data = JSON.parse(JSON.stringify(this.state.data));
    for(let i = 0; i < data.length; i++) {
      if( data[i].name.indexOf(text) != -1) searched_data.push(data[i]);
    }

    this.setState({searched_data: searched_data});
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
                  onPress={() => navigation.push('Stock_Details', {name : item.name})}
                >
                  <View style={{flex:1}}><Text style={styles.text}>{item.name}</Text></View>
                  <View style={{flex:1}}><Text style={styles.text}>{item.bs}</Text></View>
                  <TouchableOpacity
                    style={{alignItems:'center', margin:'1%'}}
                    onPress={() => this.defavorite(item)}
                  >
                    <Text style={{color: 'gold', fontSize: 16, fontWeight:'bold'}}>★</Text>
                  </TouchableOpacity>
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
              onChangeText={(text) => this.handle_text(text)}
              value={this.state.text}
            />
          </View>

          <View style={styles.button_container}>
            <Button title='high sig sort' onPress={() => this.sort_data(1)}></Button>
            <Button title='low sig sort' onPress={() => this.sort_data(-1)}></Button>
          </View>
          {this.state.text == "" ? (
            <FlatList style={styles.flatlist}
              data={this.state.data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, {backgroundColor: item.color}]}
                  onPress={() => navigation.push('Stock_Details', {name : item.name})}
                >
                  <View style={{flex:1}}><Text style={styles.text}>{item.name}</Text></View>
                  <View style={{flex:1}}><Text style={styles.text}>{item.bs}</Text></View>
                  <TouchableOpacity
                    style={{alignItems:'center', margin:'1%'}}
                    onPress={() => this.favorite(item)}
                  >
                    <Text style={{color: 'gold', fontSize: 16, fontWeight:'bold'}}>☆</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.name}
            />
          ) : (
            <FlatList style={styles.flatlist}
              data={this.state.searched_data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, {backgroundColor: item.color}]}
                  onPress={() => navigation.push('Stock_Details', {name : item.name})}
                >
                  <View style={{flex:1}}><Text style={styles.text}>{item.name}</Text></View>
                  <View style={{flex:1}}><Text style={styles.text}>{item.bs}</Text></View>
                  <TouchableOpacity
                    style={{alignItems:'center', margin:'1%'}}
                    onPress={() => this.favorite(item)}
                  >
                    <Text style={{color: 'gold', fontSize: 16, fontWeight:'bold'}}>☆</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.name}
            />
          )}
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