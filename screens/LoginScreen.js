// 구글 로그인
// https://docs.expo.io/versions/latest/sdk/google/
// https://firebase.google.com/docs/auth/web/google-signin
// https://www.youtube.com/watch?v=ZcaQJoXY-3Q&t=266s 

import React, { Component } from 'react';
import { Button, StyleSheet, Platform, View, Text } from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

class LoginScreen extends Component {

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
            );
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(function(result){
            console.log('user singned in');
            if(result.additionalUserInfo.isNewUser)
            {
            firebase
              .database()
              .ref('/users/' + result.user.uid)
              .set({
                gmail: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                first_name:  result.additionalUserInfo.profile.given_name,
                last_name:  result.additionalUserInfo.profile.family_name,
                name: result.additionalUserInfo.profile.family_name + ' ' + result.additionalUserInfo.profile.given_name,
                create_at:Date.now()
              })
              .then(function(snapshot){
                
              });
            }else{
              firebase
              .database()
              .ref('/users/' + result.user.uid).update({
                last_logged_in:Date.now()
              })
            }
          })
          .catch(function(error) {

          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '879983138338-aqnrrbi9pjgn0i03rktpuuh97lla006r.apps.googleusercontent.com',
        behavion:'web',
        iosClientId: '879983138338-38g5gjrsg6podkt9q3srbq17imo32bmf.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Google 로그인"
          onPress={() => this.signInWithGoogleAsync()}
        />
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});