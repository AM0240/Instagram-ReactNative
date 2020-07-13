// 게시글 이름표시

import firebase from 'firebase';

function getUserInfo() {

  var deviceName='유저';
  var user = firebase.auth().currentUser;
  uid = user.uid;

  firebase.database().ref('/users/' + uid).on('value',
  function a(snapshot) 
  {
    deviceName = (snapshot.val() && snapshot.val().name) || 'User';
  }
  );
  return{deviceName}
}

export default getUserInfo;
