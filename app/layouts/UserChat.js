
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import firebase from '../Firebase';
import { GiftedChat } from 'react-native-gifted-chat';

import { Actions } from 'react-native-router-flux';
import { Container, Left, Body, Right, Button, Icon, Title, Subtitle } from 'native-base';
import Utils from '../Utils';
import AppHeader from '../components/AppHeader';

const initialState = {
    messages: [],
    chatMessagesRef: null,
    isLoading: true,
}


const CustomHeader = ({ chat, user }) => {
    var currentUser = firebase.auth().currentUser;

    gotoUser = () => {
        var otherUser = {
            name: Utils.getOtherUser(currentUser.displayName, chat.title),
            id: Utils.getOtherUserId(currentUser.uid, chat.chatId)
        };
        
        Actions.profile({ user: otherUser })
    }

    return (
        <AppHeader>
            <Left style={{ flex: 1 }}>
                <Button iconLeft transparent onPress={() => Actions.pop()}>
                    <Icon style={{ color: '#FFF' }} name='arrow-back' />
                </Button>
            </Left>
            <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.gotoUser()}>
                    <Title style={{ color: '#FFF' }}>{Utils.getOtherUser(currentUser.displayName, chat.title)}</Title>
                    <Subtitle style={{ color: '#FFF' }}> tap here to view profile</Subtitle>
                </TouchableOpacity>
            </Body>
            <Right style={{ flex: 1 }} />
        </AppHeader>
    )
}

const CustomThumbnail = ({ text }) => {
    return (
        <View style={{ backgroundColor: '#841584', padding: 10, alignContent: 'center', alignItems: 'center', borderRadius: 50 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', alignSelf: 'center' }}>{text.toUpperCase()}</Text>
        </View>
    );
}

export default class UserChat extends Component {

    state = initialState;

    componentDidMount = () => {
        var messagesRef = firebase.database().ref("chatMessages/" + this.props.chat.chatId);

        messagesRef.orderByChild("createdAt").on("child_added", (snapshot) => {
            console.log("child_added");
            if (snapshot.val()) {
                // console.log(snapshot.val());
                var newMessages = [];
                newMessages.push(snapshot.val());
                // console.log(newMessages);

                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, newMessages),
                }))
            }

        }, (error) => {
            console.log(error);
        });

        console.log(messagesRef);

        this.setState({
            chatMessagesRef: messagesRef
        })
    }

    componentWillUnmount = () => {
        if (this.state.chatMessagesRef) {
            console.log("Remove chat messages listener");
            this.state.chatMessagesRef.off();
        }
    }


    onSend = (messages = []) => {

        var message = messages[0];
        message.createdAt = new Date().toString();
        console.log(message);
        firebase.database().ref("chatMessages/" + this.props.chat.chatId + "/" + message._id).set(message);

        if (this.state.messages.length <= 0) {

            var currentUser = firebase.auth().currentUser;
            var member = this.props.member;

            var chat = this.props.chat;

            chat.title = Utils.generateUserName(currentUser, member)
            chat.createAt = Date.now().toString();
            chat.lastUpdated = Date.now().toString();
            chat.type = "personal";
            chat.lastMessage = message.text;


            var updates = {};
            updates['/chats/' + chat.chatId] = chat; // Contain chat details
            updates['/userChats/' + currentUser.uid + '/' + chat.chatId] = true; // Individual chats
            updates['/userChats/' + member.id + '/' + chat.chatId] = true; // Individual chats
            updates['/chatMembers/' + chat.chatId + '/' + currentUser.uid] = true; // Chat members
            updates['/chatMembers/' + chat.chatId + '/' + member.id] = true; // Chat members

            firebase.database().ref().update(updates)
                .then(() => {
                    console.log("Done starting new chat");
                }, (error) => {
                    console.log(error);
                });
        } else {
            var updates = {}
            updates["chats/" + this.props.chat.chatId + "/lastMessage"] = message.text;
            updates["chats/" + this.props.chat.chatId + "/lastUpdated"] = Date.now().toString();
            firebase.database().ref().update(updates);
        }
    }

    renderUserAvatar(messages = []) {
        return <CustomThumbnail text={Utils.getInitials(messages.currentMessage.user.displayName)} />
    }

    render() {

        var user = firebase.auth().currentUser;
        var currentUser = {
            _id: user.uid,
            displayName: user.displayName,
            email: user.email,
            avatar: user.photoURL
        }

        return (
            <Container>
                <CustomHeader chat={this.props.chat} />

                <View style={{ flex: 1 }}>
                    <Text> {this.state.isFirst}</Text>
                    <GiftedChat
                        inverted={true}
                        messages={this.state.messages}
                        showAvatarForEveryMessage={false}
                        onSend={messages => this.onSend(messages)}
                        renderAvatar={messages => this.renderUserAvatar(messages)}
                        user={currentUser}
                    />
                </View>
            </Container>
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