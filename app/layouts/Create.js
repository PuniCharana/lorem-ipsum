
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Button,
} from 'react-native';
import firebase from '../Firebase';
import { Body, ListItem, CheckBox, Text } from 'native-base';


const initialState = {
    error: null,
    title: null,
    location: null,
    public: true
}

export default class Create extends Component {
    state = initialState;

    createNewGroup = () => {
        console.log(this.state);
        if (this.state.title && this.state.location) {
            var chatRef = firebase.database().ref("chats");

            var user = firebase.auth().currentUser;
            var chatId = chatRef.push().key;

            var chat = {};
            chat.title = this.state.title;
            chat.location = this.state.location;
            chat.createAt = Date.now();
            chat.public = this.state.public;
            chat.chatId = chatId;
            chat.createdBy = user.uid

            var updates = {};
            updates['/chats/' + chatId] = chat; // Contain chat details
            updates['/userChats/' + user.uid + '/' + chatId] = true; // Individual chats
            updates['/chatMembers/' + chatId + '/' + user.uid] = true; // Chat members

            if (this.state.public) {
                updates['/publicChats/' + chatId] = true;
            }

            firebase.database().ref().update(updates)
                .then(() => {
                    console.log("Done creating new group");
                    this.setState(initialState);
                }, (error) => {
                    console.log(error);
                });

        } else {
            console.log("Title & Location cannot be empty");
            this.setState({
                error: "Title & Location cannot be empty"
            })
        }
    }

    changeMode = () => {
        this.setState({
            public: !this.state.public
        })
    }

    render() {

        return (
            <View style={styles.container}>

                <Text>Create Group</Text>

                <TextInput
                    style={{ marginTop: 10, width: 200, padding: 8, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(title) => this.setState({ title })}
                    value={this.state.title}
                    placeholder="Title"
                />

                <TextInput
                    style={{ marginTop: 10, width: 200, padding: 8, height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(location) => this.setState({ location })}
                    value={this.state.location}
                    placeholder="Location"
                />

                <ListItem style={{ width: 200 }} onPress={() => this.changeMode()}>
                    <CheckBox checked={!this.state.public} />
                    <Body>
                        <Text>Make Private</Text>
                    </Body>
                </ListItem>

                <Button
                    style={{ marginTop: 10, }}
                    onPress={() => this.createNewGroup()}
                    title="Create"
                    color="#841584"
                />

                {
                    this.state.error ? <Text style={{ marginTop: 10, }}>{this.state.error}</Text> : null
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