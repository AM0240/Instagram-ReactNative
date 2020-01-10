import React, { Component } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { Container, Content, Header, Body, Button} from 'native-base';
import {Ionicons} from "@expo/vector-icons";
import firebase from 'firebase';

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

export default class ProfileScreen extends Component {
    state = {
        textValue: userName,
        imageValue:userPhoto
      }   
      onPress = () => {  
        firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
            userName = (snapshot.val() && snapshot.val().name) || '익명';
            
          });
        firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
            userPhoto = (snapshot.val() && snapshot.val().profile_picture) || 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
            
          });

        this.setState({
          textValue: userName,
          imageValue: userPhoto
        });
      }

    // 
    render() {
        return (
            <Container style={{ flex:1, backgroundColor: 'white'}}>
                <Header style={{backgroundColor: 'darkblue'}}>
                    <Body>
                        <Text style={{fontSize:21, color:'white', alignSelf:'center'}}>{this.state.textValue}</Text>
                    </Body>
                </Header>

                <Header style={{backgroundColor: 'darkblue'}}>
                    <Body>
                        <Text style={{fontSize:17, color:'lightgray', alignSelf:'center'}}>{userEmail}</Text>
                    </Body>
                </Header>

                <Header style={{backgroundColor:'white', height:170}}>
                        <Image source={{ uri: this.state.imageValue }} style={{height: 150, width: 150, marginTop:10, borderRadius:75, alignSelf:'center'}}/>
                </Header>

                <Content>
                    <View style={{flexDirection:'row', paddingTop:10}}>
                        <View style={{flex:3}}>
                            <View style={{flexDirection:'row', marginTop:0}}>
                                <Button bordered dark
                                    style={{flex:1, marginLeft:5,marginRight:5, justifyContent:'center', height:60, marginTop:10}}
                                    onPress={() => this.props.navigation.navigate('updateProfileScreen')}>
                                    <Ionicons color = "dimgray" size ={23} name = "md-brush"/>
                                    <Text style={{marginLeft:15, fontSize:16}}>프로필 수정</Text>
                                </Button>

                                <Button bordered dark small icon
                                    title="로그아웃" style={{flex:1, marginRight:5, marginLeft:0, justifyContent:'center', height:60, marginTop:10, backgroundColor:'white'}} 
                                    onPress={() => firebase.auth().signOut()}>

                                    <Ionicons color = "dimgray" size ={23} name = "ios-eye-off"/>
                                    <Text style={{marginLeft:10, fontSize:14 ,color:'black'}}>로그아웃</Text>
                                </Button>
                                <Button bordered dark small icon
                                    title="새로고침" style={{flex:1, marginRight:5, marginLeft:0, justifyContent:'center', height:60, marginTop:10, backgroundColor:'white'}} 
                                    onPress={this.onPress}>

                                    <Ionicons color = "dimgray" size ={23} name = "ios-refresh"/>
                                    <Text style={{marginLeft:10, fontSize:14 ,color:'black'}}>새로고침</Text>
                                </Button>
                            </View>                        
                        </View>
                    </View>
                </Content>
            </Container>
                      
        );
    }
}              
const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});