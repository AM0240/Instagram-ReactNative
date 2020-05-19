// https://docs.expo.io/versions/latest/guides/using-firebase/
// 관련문서

import uuid from 'uuid';

import getUserInfo from './utils/getUserInfo';
import shrinkImageAsync from './utils/shrinkImageAsync';
import uploadPhoto from './utils/uploadPhoto';

const firebase = require('firebase');

require('firebase/firestore');

const collectionName = 'postData';

///////////////////
var firebaseConfig = {
  apiKey: "AIzaSyCjVKhEKAJ4aSVnqpg-EUSbsAmIXMrs8sQ",
  authDomain: "sns-by-team-int.firebaseapp.com",
  databaseURL: "https://sns-by-team-int.firebaseio.com",
  projectId: "sns-by-team-int",
  storageBucket: "sns-by-team-int.appspot.com",
  messagingSenderId: "322226380178",
  appId: "1:322226380178:web:e897a963eec371ee3f754b"
};


///////////////////
class Fire {
  constructor() {
    firebase.initializeApp({
      apiKey: 'AIzaSyCjVKhEKAJ4aSVnqpg-EUSbsAmIXMrs8sQ',
      authDomain: 'sns-by-team-int.firebaseapp.com',
      databaseURL: 'https://sns-by-team-int.firebaseio.com',
      projectId: 'sns-by-team-int',
      storageBucket: 'sns-by-team-int.appspot.com',
      messagingSenderId: '322226380178',
    });
   
    firebase.firestore().settings({ timestampsInSnapshots: true });

   
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    });
  }

  // 데이터 다운로드
  getPaged = async ({ size, start }) => {
    let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];

      var deviceName='익명';
      var user = firebase.auth().currentUser;
      uid = user.uid;

      firebase.database().ref('/users/' + uid).on('value',
      function a(snapshot) 
      {
        deviceName = (snapshot.val() && snapshot.val().name) || '익명';
      }
      );

      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const post = doc.data() || {};

          
          const user = post.user || {};

          const name = user.deviceName;
          const reduced = {
            key: doc.id,
            name: (name || 'Secret Duck').trim(),
            ...post,
          };
          data.push(reduced);
        }
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { data, cursor: lastVisible };
    } catch ({ message }) {
      alert(message);
    }
  };

  // 업로드 데이터
  uploadPhotoAsync = async uri => {
    const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
    return uploadPhoto(uri, path);
  };

  post = async ({ text, image: localUri }) => {
    try {
      const { uri: reducedImage, width, height } = await shrinkImageAsync(
        localUri,
      );

      const remoteUri = await this.uploadPhotoAsync(reducedImage);
      this.collection.add({
        text,
        uid: this.uid,
        timestamp: this.timestamp,
        imageWidth: width,
        imageHeight: height,
        image: remoteUri,
        user: getUserInfo(),
      });
    } catch ({ message }) {
      alert(message);
    }
  };

  get collection() {
    return firebase.firestore().collection(collectionName);
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
  get timestamp() {
    return Date.now();
  }

  
}


Fire.shared = new Fire();
export default Fire;
