
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import firebase from '../Firebase';
import { Actions } from 'react-native-router-flux';
import { Thumbnail } from 'native-base';

export default class Login extends Component {

    logout = () => {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            Actions.replace("login");
        }).catch(function (error) {
            // An error happened.
            console.log(error);
        });
    }

    render() {
        var user = firebase.auth().currentUser;

        return (
            <View style={styles.container}>
                <Thumbnail large source={{ uri: user.photoURL }} />
                <Text>{user.displayName}</Text>
                <Text>{user.email}</Text>
                <Button
                    onPress={() => this.logout()}
                    title="Logout"
                    color="#841584"
                />

                <Button
                    onPress={() => Actions.chats()}
                    title="Chats"
                    color="#841584"
                />

                <Button
                    onPress={() => Actions.search()}
                    title="Search"
                    color="#841584"
                />

                <Button
                    onPress={() => Actions.creategroup()}
                    title="Create Group"
                    color="#841584"
                />

                 <Button
                    onPress={() => Actions.sample1()}
                    title="Sample 1"
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
});