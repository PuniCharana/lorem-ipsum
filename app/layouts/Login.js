
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button
} from 'react-native';
import firebase from '../Firebase';
import { Actions } from 'react-native-router-flux';

export default class Login extends Component {

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        Actions.replace("home")
      } else {
        // No user is signed in.
      }
    });

  }

  loginUserA = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  loginUserB = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  render() {
    return (
      <View style={styles.container}>

        <Button
          onPress={() => this.loginUserA("usera@gmail.com", "123456")}
          title="User Alice"
          color="#841584"
        />

        <Button
          onPress={() => this.loginUserB("userb@gmail.com", "123456")}
          title="User Bob"
          color="#841584"
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});