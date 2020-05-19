// 게시글의 이름을 현재 접속중인 유저의 이름으로 표시
// 유저가 없다면 익명

import firebase from 'firebase';

function getUserInfo() {

  var deviceName='익명';
  var user = firebase.auth().currentUser;
  uid = user.uid;

  firebase.database().ref('/users/' + uid).on('value',
  function a(snapshot) 
  {
    deviceName = (snapshot.val() && snapshot.val().name) || '익명';
  }
  );
  return{deviceName}
}

export default getUserInfo;
