import uuid from 'uuid';
import getUserInfo from './utils/getUserInfo';
import shrinkImageAsync from './utils/shrinkImageAsync';
import uploadPhoto from './utils/uploadPhoto';

const firebase = require('firebase');
require('firebase/firestore');
const collectionName = 'postData';

var firebaseConfig = {
  apiKey: "AIzaSyB7q7MrkEJxkHJ1k0GvQ7K3BJoSMcr7qFw",
  authDomain: "instagram-with-react.firebaseapp.com",
  databaseURL: "https://instagram-with-react.firebaseio.com",
  projectId: "instagram-with-react",
  storageBucket: "instagram-with-react.appspot.com",
  messagingSenderId: "214525119735",
  appId: "1:214525119735:web:c2a45da644368c049657f2"
};

class Fire {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyB7q7MrkEJxkHJ1k0GvQ7K3BJoSMcr7qFw",
      authDomain: "instagram-with-react.firebaseapp.com",
      databaseURL: "https://instagram-with-react.firebaseio.com",
      projectId: "instagram-with-react",
      storageBucket: "instagram-with-react.appspot.com",
      messagingSenderId: "214525119735",
      appId: "1:214525119735:web:c2a45da644368c049657f2"
    });
   
    firebase.firestore().settings({ timestampsInSnapshots: true });
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    });
  }

  getPaged = async ({ size, start }) => {
    let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];

      var deviceName='비로그인';
      var user = firebase.auth().currentUser;
      uid = user.uid;

      firebase.database().ref('/users/' + uid).on('value',
      function a(snapshot) 
      {
        deviceName = (snapshot.val() && snapshot.val().name) || '비로그인';
      }
      );

      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const post = doc.data() || {};

          
          const user = post.user || {};

          const name = user.deviceName;
          const reduced = {
            key: doc.id,
            name: (name || '???').trim(),
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
