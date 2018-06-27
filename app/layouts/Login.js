
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native';
import firebase from '../Firebase';
import { Actions } from 'react-native-router-flux';
import Globals from '../Globals';

const initialState = {
  authListener: null,
  email: null,
  password: null,
  error: null
}

export default class Login extends Component {

  state = initialState;

  componentDidMount() {
    var auth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        Actions.replace("chats")
      } else {
        // No user is signed in.
      }
    });

    this.setState({
      authListener: auth
    })

  }

  componentWillUnmount = () => {
    if (this.state.authListener) this.state.authListener();
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

  login = () => {

    if (!this.state.email || !this.state.password) {
      this.setState({
        status: null,
        error: "email & password cannot be empty"
      })
      return
    }

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        this.setState({
          error: errorMessage
        })
      });
  }

  render() {
    return (
      <View style={styles.container}>

        <Text>Login</Text>

        <TextInput
          style={{ marginTop: 10, width: 200, padding: 8, height: 40, }}
          onChangeText={(email) => this.setState({ email, error: null })}
          value={this.state.userEmail}
          placeholder="Email"
        />

        <TextInput
          secureTextEntry={true}
          style={{ marginTop: 10, width: 200, padding: 8, height: 40, }}
          onChangeText={(password) => this.setState({ password, error: null })}
          value={this.state.password}
          placeholder="Password"
        />

        <Text style={{
          width: 220,
          padding: 8,
          color: 'red',
          textAlign: 'center'
        }}>{this.state.error}</Text>

        <View style={{
          width: 220,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>

          <View style={{ flex: 1 }}></View>
          <Button
            onPress={() => this.login()}
            title="Login"
            color={Globals.COLOR.PRIMARY}
          />
        </View>

        <View style={{
          width: 220,
          flexDirection: 'row',
          padding: 8
        }}>

          <Text>Don't have an account?</Text>

          <TouchableOpacity onPress={() => Actions.replace("signup")}>
            <Text style={{ color: Globals.COLOR.PRIMARY }}> Signup</Text>
          </TouchableOpacity>
        </View>

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