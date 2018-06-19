import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDNCERo2BSajfpRjtXmeaf6C-CKCVT3l2w",
  authDomain: "awesomechatapp.firebaseapp.com",
  databaseURL: "https://awesomechatapp.firebaseio.com",
  projectId: "firebase-awesomechatapp",
  storageBucket: "firebase-awesomechatapp.appspot.com",
  messagingSenderId: "733106505345"
};

firebase.initializeApp(config);

export default firebase;