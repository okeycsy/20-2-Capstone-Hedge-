import React, { Component } from 'react';
import { View, Animated } from 'react-native';

export default class Test extends Component {
    constructor(props){
      super(props);
      this.state = {
        positions: [
          new Animated.ValueXY({x:0, y:0}),
          new Animated.ValueXY({x:0, y:0}),
          new Animated.ValueXY({x:0, y:0}),
          new Animated.ValueXY({x:0, y:0}),
          new Animated.ValueXY({x:0, y:0}),
          new Animated.ValueXY({x:0, y:0}),
        ]
      };
    }
  
    componentDidMount(){
        Animated.sequence(
          this.state.positions.map(position => this._moveX(position))
        ).start();
    }
  
    _moveX(position){
      return Animated.timing (
        position, {
          toValue : {x:200, y:0},
          duration : 300,
          delay : 0
      });
    }
  
    _getStyle(position){
      return {
        width: 100, height: 100,
        backgroundColor: 'red',
        transform:[
          {translateX:position.x},
        ]
      }
    }
  
    render() {
      return (
        <View>
          {
            this.state.positions.map((position, index) => {
              return (
                <View>
                  <Animated.View style={this._getStyle(position)} key={index}/>
                  <Animated.View style={this._getStyle(position)} key={index}/>
                </View>
              )
            })
          }
        </View>
      );
    }
  }