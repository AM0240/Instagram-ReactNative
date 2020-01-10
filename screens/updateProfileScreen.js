import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Body, Button } from 'native-base';
import {Ionicons} from "@expo/vector-icons";
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

var user = firebase.auth().currentUser;
var userUid, userName, userEmail, userPhoto;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        user.providerData.forEach(function (profile) {
            userUid=profile.uid;
            uid = user.uid;
            firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
              userName = (snapshot.val() && snapshot.val().name) || '익명';
              
            });
            userEmail=profile.email;
            firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
              userPhoto = (snapshot.val() && snapshot.val().profile_picture) || 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
              
            });
          });        
    } else {
            userEmail='로그인하세요';
    }
  });

export default class updateProfileScreen extends Component {
 
  constructor(props) {
    super(props);
    this.state = { text: userName };
  }

  state = {
    image: null,
  };

    render() {
      let { image } = this.state;

        return (
          
          <Container style={{ flex:1, backgroundColor: 'white'}}>
              <Header style={{backgroundColor: 'purple'}}>
                <Body>
                    <Text style={{fontSize:21, color:'white', alignSelf:'center'}}>프로필 수정</Text>
                </Body>
              </Header>

              <Header style={{backgroundColor:'white', height:170}}>
                <TouchableOpacity onPress={this._pickImage}>
                  <Image source={{ uri: userPhoto }} style={{height: 150, width: 150, marginTop:10, borderRadius:75, alignSelf:'center'}}/>
                </TouchableOpacity>
              </Header>
              

          
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop:30, alignSelf:'center', width:300, fontSize:21 }}
              textAlign={'center'}
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
            />

            <Button bordered dark small icon
              title="확인" style={{alignSelf:'center',marginTop:60, justifyContent:'center', backgroundColor:'white', width:120,height:40}}          
              onPress=
              {
                () => 
                {
                  firebase.database().ref('/users/' + uid).update({
                  name:(this.state.text)})

                  if(image)
                  {
                    firebase.database().ref('/users/' + uid).update({
                    profile_picture:(image)})
                  }

                  firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
                    userName = (snapshot.val() && snapshot.val().name) || '익명';
                    
                  });

                  firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
                    userPhoto = (snapshot.val() && snapshot.val().profile_picture) || 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
                    
                  });

                  this.props.navigation.navigate('Main');
                  function refreshPage() {
                    window.location.reload();
                  }
                }  
              }>
              <Ionicons color = "black" size ={60} name = "ios-checkmark"/>
              <Text style={{marginLeft:10, fontSize:23 ,color:'black'}}>완료</Text>
            </Button>
            
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Button
                title="기기에서 사진 선택"
                onPress={this._pickImage}
              />
            </View>
      </Container>
        );
    }

    componentDidMount() {
      this.getPermissionAsync();
    }
    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('권한이 필요합니다');
        }
      }
    }
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      userPhoto=result.uri;
      this.props.navigation.navigate('updateProfileScreen');
  
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    };
}              
 
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});