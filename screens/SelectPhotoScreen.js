import { Constants } from "expo";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import getPermission from "../utils/getPermission";
import {Ionicons} from "@expo/vector-icons";
import { Icon, Container, Content, Header, Left, Body, Right, Button } from 'native-base';

const options = {
  allowsEditing: true
};

export default class SelectPhotoScreen extends Component {
  state = {};

  _selectPhoto = async () => {
    const status = await getPermission(Permissions.CAMERA_ROLL);
    if (status) {
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.cancelled) {
        this.props.navigation.navigate("NewPost", { image: result.uri });
      }
    }
  };

  _takePhoto = async () => {
    const status = await getPermission(Permissions.CAMERA);
    if (status) {
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.cancelled) {
        this.props.navigation.navigate("NewPost", { image: result.uri });
      }
    }
  };

  render() {
    return (
      <Container style={{ flex:1, backgroundColor: 'white'}}>
        <Header style={{backgroundColor: 'seagreen'}}>
          <Body><Text style={{fontSize:17, color:'white', alignSelf:'center'}}>업로드</Text></Body>
        </Header>

        <View style={styles.container}>
          <Ionicons onPress={this._selectPhoto} color = "darkviolet" size ={40} name = "ios-images"/>
          <Text onPress={this._selectPhoto} style={styles.text}>
            사진선택
          </Text>

          <Text style={{marginTop:10, marginBottom:10}}>-----------------------</Text>
        
          <Ionicons onPress={this._takePhoto} color = "darkblue" size ={40} name = "ios-camera"/>
          <Text onPress={this._takePhoto} style={styles.text}>
            사진촬영
          </Text>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    padding: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});
