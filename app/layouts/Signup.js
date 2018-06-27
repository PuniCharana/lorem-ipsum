
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from '../Firebase';
import Globals from '../Globals';

const initialState = {
    name: null,
    email: null,
    password: null,
    error: null,
    status: null // Debug
}

export default class Signup extends Component {

    state = initialState;

    signup = () => {
        this.setState({
            status: "signup"
        })

        if (!this.state.email || !this.state.name || !this.state.password) {
            this.setState({
                status: null,
                error: "Name, email & password cannot be empty"
            })
            return
        }


        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((response) => {
                console.log(response);
                this._updateUserProfile()
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
                this.setState({
                    error: error.message
                })
            });
    }

    _updateUserProfile = () => {
        this.setState({
            status: "_updateUserProfile"
        })
        var user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: this.state.name
        }).then(() => {
            // Update successful.
            this._saveUserInfo(user);
            console.log("Update successful.");
        }).catch((error) => {
            // An error happened.
            console.log("An error happened.");
            console.log(error);
            this.setState({
                error: error.message
            })
        });
    }

    _saveUserInfo = (user) => {
        this.setState({
            status: "_saveUserInfo"
        })
        firebase.database().ref("users/" + user.uid).set({
            name: user.displayName,
            email: user.email,
            id: user.uid
        }).then(() => {
            Actions.chats();
            this.setState({
                status: user.displayName
            })
        }).catch((error) => {
            console.log(error);
            this.setState({
                error: error.message
            })
        });
    }

    render() {

        return (
            <View style={styles.container}>

                <Text>Signup</Text>
                {/* <Text>{this.state.status}</Text> */}

                <TextInput
                    style={{ marginTop: 10, width: 200, padding: 8, height: 40, }}
                    onChangeText={(name) => this.setState({ name, error: null })}
                    value={this.state.name}
                    placeholder="User Name"
                />

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
                        onPress={() => this.signup()}
                        title="Signup"
                        color={Globals.COLOR.PRIMARY}
                    />
                </View>

                <View style={{
                    width: 220,
                    flexDirection: 'row',
                    padding: 8
                }}>

                    <Text>Already have account?</Text>

                    <TouchableOpacity onPress={() => Actions.replace("login")}>
                        <Text style={{ color: Globals.COLOR.PRIMARY }}> Login</Text>
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
});