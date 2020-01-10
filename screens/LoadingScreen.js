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
      if(user)  { this.props.navigation.navigate('Main'); }
      else  { this.props.navigation.navigate('LoginScreen');  }
    }.bind(this)
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large'/>
        <Text style={{marginTop:10}}>로그인 확인 중</Text>
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