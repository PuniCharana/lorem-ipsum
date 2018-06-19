
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import firebase from '../Firebase';
import { List, ListItem } from 'native-base';

export default class ChatDetails extends Component {

    state = {
        chatMembers: []
    }

    componentWillMount = () => {
        var chat = this.props.chat;
        firebase.database().ref('chatMembers/' + chat.chatId).once("value", (snapshot) => {
            snapshot.forEach((member) => {
                this.setState(prevSate => ({
                    chatMembers: [...prevSate, member.key]
                }));
            })
        })
    }

    render() {

        var chat = this.props.chat;

        return (
            <View style={styles.container}>



                <Text>{chat.title}</Text>
                <Text>{chat.location}</Text>
                <Text>{chat.createAt}</Text>
                <Text>{this.state.chatMembers.length} members</Text>

                <List style={{ flex: 1 }}>
                    {
                        this.state.chatMembers.map((member, index) => {
                            return (
                                <ListItem key={index} onPress={()=> Actions.chat({chat: {title: "Hello World"}})}>
                                    <Text>{member}</Text>
                                </ListItem>
                            )
                    })
                }
                </List>
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