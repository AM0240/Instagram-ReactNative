// 로그인중이면 목록으로 돌아가고 아니라면 로그인창을 띄움

import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Platform, View, Text } from 'react-native';
import firebase from 'firebase';

class LoadingScreen extends Component {

  componentDidMount(){
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () =>{

    firebase.auth().onAuthStateChanged(function(user)
    {
      // 로그인 됐다면 Main으로 이동
      if(user)
      {
      this.props.navigation.navigate('Main');
      }

      // 비로그인이라면 LoginScreen으로 이동
      else
      {
        this.props.navigation.navigate('LoginScreen');
      }
    }.bind(this)
    );
  };
  render() {
    return (
      // 로딩이미지 표시

      <View style={styles.container}>
        <ActivityIndicator size='large'/>
        <Text style={{marginTop:10}}>로그인 확인... 이 페이지는 무시하세요</Text>
      </View>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});