
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import firebase from '../Firebase';
import { List, ListItem } from 'native-base';
import { Actions } from 'react-native-router-flux';

export default class Search extends Component {

    state = {
        error: null,
        isLoading: true,
        chats: []
    }

    componentWillMount = () => {
        var user = firebase.auth().currentUser;

        firebase.database().ref("publicChats/").once("value", (snapshot) => {
            snapshot.forEach((chatsSnapshot) => {
                firebase.database().ref("chats/" + chatsSnapshot.key).once("value", (snapshot) => {
                    this.setState(previousState => ({
                        isLoading: false,
                        chats: [...previousState.chats, snapshot.val()]
                    }))
                }, (error) => {
                    this.setState({
                        isLoading: false,
                        error: error.message
                    })
                })
            });
            if (!snapshot.val()) {
                this.setState({
                    isLoading: false,
                    error: "Data not found!"
                })
            }
        }, (error) => {
            this.setState({
                isLoading: false,
                error: error.message
            })
        });
    }


    render() {

        if (!this.state.isLoading && !this.state.error) {
            return (

                <List>
                    {
                        this.state.chats.map((chat) => (
                            <ListItem key={chat.id} onPress={() => Actions.chat({ chat: chat })}>
                                <Text>{chat.title}</Text>
                            </ListItem>
                        ))
                    }
                </List>
            )
        }
        return (
            <View style={styles.container}>

                {
                    this.state.isLoading ? <ActivityIndicator size="small" color="#00ff00" /> : this.state.error ? <Text>{this.state.error}</Text> : null
                }

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