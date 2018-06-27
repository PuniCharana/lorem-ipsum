
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import firebase from '../Firebase';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import AppHeader from '../components/AppHeader';

import { Actions } from 'react-native-router-flux';
import { Container, Left, Body, Right, Button, Icon, Title, Subtitle } from 'native-base';
import Globals from '../Globals';

const initialState = {
    messages: [],
    chatMessagesRef: null,
    isLoading: true,
}

const CustomHeader = ({ chat }) => (
    <AppHeader>
        <Left style={{ flex: 1 }}>
            <Button iconLeft transparent onPress={() => Actions.pop()}>
                <Icon style={{ color: '#FFF' }} name='arrow-back' />
            </Button>
        </Left>
        <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => Actions.chatdetails({ chat: chat })}>
                <Title style={{ color: '#FFF' }}>{chat.title}</Title>
                <Subtitle style={{ color: '#FFF' }}> tap here to view details</Subtitle>
            </TouchableOpacity>
        </Body>
        <Right style={{ flex: 1 }} />
    </AppHeader>
)

const CustomThumbnail = ({ text }) => {
    return (
        <View style={{ backgroundColor: '#841584', padding: 10, alignContent: 'center', alignItems: 'center', borderRadius: 50 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', alignSelf: 'center' }}>{text.toUpperCase()}</Text>
        </View>
    );
}

export default class Chat extends Component {

    state = initialState;

    constructor(props) {
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ]
    }

    componentDidMount() {
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
        message.createdAt = new Date();

        var updates = {}
        updates["chatMessages/" + this.props.chat.chatId + "/" + message._id] = message;
        updates["chats/" + this.props.chat.chatId + "/lastMessage"] = message.text;
        updates["chats/" + this.props.chat.chatId + "/lastUpdated"] = Date.now().toString();
        firebase.database().ref().update(updates);
    }

    renderUserAvatar(messages = []) {
        return <CustomThumbnail text={this.getText(messages.currentMessage.user.displayName)} />
    }

    getText = (str) => {
        var res = str.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1).toUpperCase();
        } else {
            console.log(str)
            var shortText = str.slice(0, 2);
            console.log(shortText)
            return shortText.toUpperCase();
        }

    }

    render() {

        var user = firebase.auth().currentUser;
        var currentUser = {
            _id: user.uid,
            displayName: user.displayName,
            email: user.email,
            avatar: user.photoURL
        }

        console.log("Before: ", this.state.messages);

        // var sortedMessages = this.state.messages.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1 )
        // console.log("After :", messages);
        return (
            <Container>
                <CustomHeader chat={this.props.chat} />
                <View style={{ flex: 1 }}>
                    <GiftedChat
                        alwaysShowSend={true}
                        // renderSend={messages => this.onSend(messages)}
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