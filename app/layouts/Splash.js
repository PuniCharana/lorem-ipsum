
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import firebase from '../Firebase';
import { Actions } from 'react-native-router-flux';

const initialState = {
    authListener: null
}

export default class Splash extends Component {

    state = initialState;

    constructor(props) {
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ]
    }

    componentDidMount() {
        var auth = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                Actions.replace("chats")
            } else {
                // No user is not signed in.
                Actions.replace("login")
            }
        });

        this.setState({
            authListener: auth
        })

    }

    componentWillUnmount = () => {
        if (this.state.authListener) this.state.authListener();
    }

    render() {

        return (
            <View style={styles.container}>

                <Text>Besocial</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});