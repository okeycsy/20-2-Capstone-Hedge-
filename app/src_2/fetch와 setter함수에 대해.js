import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
/*
  상품 :
  한도 :
*/
function showProductDetail(data) {
  data.pop()
  alert(data)
}

export default function App() {
  // 참고 : https://reactnative.dev/docs/network
  // setLoading과 setData는 setter 함수(이름은 마음대로 지어도 됨)
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  // 서버에서 res.json 으로 보낸 json을 fetch를 통해 가져옴
  // fetch에 쓰인 url은 document에서 예제로 쓴 것
  // 끝의 []는 에러났을 때 []를 반환한다는 뜻
  useEffect(() => {
    fetch('https://reactnative.dev/movies.json')
      .then((response) => response.json())
      .then((json) => setData(json.movies))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // setData : setter 함수
  // setter 함수를 통해 상태를 바꾸고, 상태가 바뀔 때마다 render
  // test : 클릭하면 맨 앞 요소 삭제
  const test = () => {
    // 깊은 복사 후, 수정하고 setter함수에 전달
    // 비효율적인 방법이지만, 다른 방법을 아직 모르겠음
    let temp_data = JSON.parse(JSON.stringify(data)) 
    temp_data.shift()
    setData(temp_data)
  }

  // test : 버튼 누르면 내림차순 정렬(releaseYear)
  const test2 = () => {
    let temp_data = JSON.parse(JSON.stringify(data))
    // 크기를 하나씩 비교해 sort에 넘겨주는 방식
    // 1, -1, 0 : 내림차순
    // -1, 1, 0 : 오름차순
    temp_data.sort(function(a, b) {
      return a.releaseYear < b.releaseYear ? 1 : a.releaseYear > b.releaseYear ? -1 : 0;
    })
    // setter를 통해 state 변경
    setData(temp_data)
  }

  // test : 버튼 누르면 오름차순 정렬(releaseYear)
  const test3 = () => {
    let temp_data = JSON.parse(JSON.stringify(data))
    temp_data.sort(function(a, b) {
      return a.releaseYear < b.releaseYear ? -1 : a.releaseYear > b.releaseYear ? 1 : 0;
    })
    setData(temp_data)
  }

  return (
    <View>
      {isLoading ? <ActivityIndicator/> : (
        <View>
          <Button
            title='Test2'
            onPress={() => test2()}
          />
          <Button
            title='Test3'
            onPress={() => test3()}
          />

          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <TouchableOpacity
              style = {styles.TouchableOpacitySyle}
              onPress = {() => test()}
            >
              <Text>{item.title}</Text>
              <Text>{item.releaseYear}</Text>
            </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  TouchableOpacitySyle: {
    flexDirection: 'row'
  }
});
