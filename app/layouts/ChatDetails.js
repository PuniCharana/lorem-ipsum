
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from '../Firebase';
import { Content, Container, List, ListItem, Left, Body, Right, Button, Icon, Title, Subtitle, Root } from 'native-base';
import Utils from '../Utils';
import AppHeader from '../components/AppHeader';
import Globals from '../Globals';


const CustomHeader = () => (
    <AppHeader>
        <Left style={{ flex: 1 }}>
            <Button iconLeft transparent onPress={() => Actions.pop()}>
                <Icon style={{ color: '#FFF' }} name='arrow-back' />
            </Button>
        </Left>
        <Body style={{ flex: 3 }} />
        <Right style={{ flex: 1 }} />
    </AppHeader>
)

const CustomProfile = ({ chat, chatMembers, isAMember }) => {

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

    onJoinPress = () => {
        var user = firebase.auth().currentUser;

        if (user) {

            var currentuser = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email
            }

            var updates = {};
            updates['/userChats/' + currentuser.uid + '/' + chat.chatId] = true;
            updates['/chatMembers/' + chat.chatId + '/' + currentuser.uid] = true;
            firebase.database().ref().update(updates)
        }
    }

    onExitPress = () => {
        var currentuser = firebase.auth().currentUser;

        if (currentuser) {
            var updates = {};
            updates['/userChats/' + currentuser.uid + '/' + chat.chatId] = null;
            updates['/chatMembers/' + chat.chatId + '/' + currentuser.uid] = null;
            firebase.database().ref().update(updates)
        }
    }

    return (
        <View style={{ flexDirection: 'row', padding: 16, backgroundColor: Globals.COLOR.PRIMARY }}>

            <View style={{
                padding: 10,
                width: 70,
                height: 70,
                marginRight: 16,
                backgroundColor: '#841584',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 50
            }}>
                <Text style={{ flex: 1, color: '#fff', textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>
                    {this.getText(chat.title)}
                </Text>
            </View>

            <View style={{
                flex: 1, flexDirection: 'column', alignContent: 'center',
            }}>
                <Text style={[styles.textColor, { fontWeight: 'bold', fontSize: 18 }]}>{chat.title}</Text>
                <Text style={[styles.textColor]}>{chat.location}</Text>
                <Text style={[styles.textColor, {
                    fontSize: 12
                }]}>Created by: {chat.createdBy}</Text>
            </View>

            {
                chatMembers.length > 0 ? (
                    <View style={{marginLeft: 6}}>
                        {
                            isAMember ? (
                                <Button rounded style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }} onPress={() => this.onExitPress()}>
                                    <Text style={{ color: '#fff' }}>Exit</Text>
                                </Button>
                            ) : (
                                    <Button rounded style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }} onPress={() => this.onJoinPress()}>
                                        <Text style={{ color: '#fff' }}>Join</Text>
                                    </Button>
                                )
                        }
                    </View>

                ) : null
            }
        </View>
    )

}

const initialState = {
    isAMember: false,
    chatMembers: [],
}

export default class ChatDetails extends Component {

    state = initialState;

    componentDidMount = () => {
        var currentuser = firebase.auth().currentUser;
        var chat = this.props.chat;
        firebase.database().ref('chatMembers/' + chat.chatId).on("value", (snapshot) => {
            this.setState(initialState);
            snapshot.forEach((member) => {
                firebase.database().ref("users/" + member.key).once("value", (userSnapshot) => {

                    if (userSnapshot.val()) {
                        this.setState(prevSate => ({
                            chatMembers: [...prevSate.chatMembers, userSnapshot.val()]
                        }));

                        if (userSnapshot.val().id == currentuser.uid) {
                            this.setState({
                                isAMember: true
                            });
                        }
                    }

                })
            })
        })
    }

    onUserProfileCick = (member) => {

        Actions.profile({ user: member })
    }

    render() {
        var user = firebase.auth().currentUser;

        return (
            <Root>
                <Container>
                    <CustomHeader chat={this.props.chat} user={user} />
                    <CustomProfile chat={this.props.chat} isAMember={this.state.isAMember} chatMembers={this.state.chatMembers} />
                    <Content>
                        <View style={{ padding: 16, flexDirection: 'column' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Description</Text>
                            <Text>{this.props.chat.description}</Text>
                        </View>

                        {
                            this.state.isAMember ? (

                                <ListItem icon onPress={() => Actions.chat({ chat: this.props.chat })}>
                                    <Left>
                                        <Icon name="chatbubbles" />
                                    </Left>
                                    <Body>
                                        <Text>Conversation</Text>
                                    </Body>
                                    <Right>
                                        <Text style={{ color: Globals.COLOR.PRIMARY }}>View</Text>
                                    </Right>
                                </ListItem>
                            ) : null
                        }

                        <View style={{ padding: 16 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.state.chatMembers.length} participants</Text>
                        </View>

                        <List>
                            {
                                this.state.chatMembers.map((member, index) => {

                                    if (member.id === user.uid) {
                                        return (
                                            <ListItem avatar key={index} onPress={() => Actions.profile()}>
                                                <Left>
                                                    <CustomThumbnail text={Utils.getInitials(member.name)} />
                                                </Left>
                                                <Body>
                                                    <Text padder>{member.name} (You)</Text>
                                                    <Text></Text>
                                                </Body>
                                                <Right />
                                            </ListItem>
                                        )
                                    }
                                    return (
                                        <ListItem avatar key={index} onPress={() => this.onUserProfileCick(member)}>
                                            <Left>
                                                <CustomThumbnail text={Utils.getInitials(member.name)} />
                                            </Left>
                                            <Body>
                                                <Text>{member.name}</Text>
                                                <Text></Text>
                                            </Body>
                                            <Right />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>

                    </Content>
                </Container>
            </Root>
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
    textColor: {
        color: '#fff'
    }
});