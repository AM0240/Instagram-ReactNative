// Firebase 이용해 구글아이디로 로그인
// https://docs.expo.io/versions/latest/sdk/google/        <- Using it inside of the Expo app 항목 참고
// https://firebase.google.com/docs/auth/web/google-signin <- Advanced: Handle the sign-in flow manually 항목 참고
// https://www.youtube.com/watch?v=ZcaQJoXY-3Q&t=266s      <- 해당 강의

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
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
            );
        // Sign in with credential from the Google user.
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
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
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
        androidClientId: '322226380178-629d6vfnb30fh48npmauhrkfquml7pg8.apps.googleusercontent.com',
        behavion:'web',
        iosClientId: '322226380178-mal1gg330har5le7b56p3b25t5kn93cq.apps.googleusercontent.com',
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