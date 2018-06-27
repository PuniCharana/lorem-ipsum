
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Container, Content, Left, Right, Body, Icon, Button, Root, ActionSheet } from 'native-base';
import { Actions } from 'react-native-router-flux';
import GLOBALS from '../Globals';
import firebase from 'firebase';
import Utils from '../Utils';

var BUTTONS = [
    { text: "Logout", icon: "log-out", iconColor: "#fa213b" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];
var LOGOUT_INDEX = 0;
var CANCEL_INDEX = 1;

export default class Profile extends Component {

    showProfileActionSheet = (name) => {

        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                title: name
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case LOGOUT_INDEX: {
                        console.log("Logout");
                        firebase.auth().signOut().then(() => {
                            // Sign-out successful.
                            Actions.login();
                        }, (error) => {
                            // An error happened.
                        });
                        break;
                    }
                    case CANCEL_INDEX: {
                        console.log("Cancel");
                        break;
                    }
                }
            }
        )
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

    logOut = () => {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            Actions.login();
        }, (error) => {
            // An error happened.
        });
    }

    goToChat = () => {

        var user = firebase.auth().currentUser;
        var member = this.props.user;

        var chat = {
            chatId: Utils.generateUserId(user.uid, member.id, ),
            title: Utils.generateUserName(user, member),
        }

        Actions.userchat({ chat: chat, member })
    }


    render() {

        var currentUser = firebase.auth().currentUser;
        var user = this.props.user;

        return (
            <Root>
                <Container>
                    <AppHeader>
                        <Left style={{ flex: 1 }}>
                            <Button iconLeft transparent onPress={() => Actions.pop()}>
                                <Icon style={{ color: '#FFF' }} name='arrow-back' />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3 }}>
                        </Body>
                        {
                            user ? <Right /> : (
                                <Right style={{ flex: 1 }}>
                                    <Button transparent onPress={() => this.showProfileActionSheet(currentUser.displayName)}>
                                        <Icon style={{ color: GLOBALS.COLOR.WHITE }} name='settings' />
                                    </Button>
                                </Right>
                            )
                        }

                    </AppHeader>
                    <Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: GLOBALS.COLOR.PRIMARY }}>

                            <View style={{
                                backgroundColor: GLOBALS.COLOR.GRAY,
                                padding: 10,
                                width: 70,
                                height: 70,
                                marginRight: 16,
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                                borderRadius: 50
                            }}
                            >
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        color: GLOBALS.COLOR.PRIMARY,
                                        fontWeight: 'bold',
                                        alignSelf: 'center'
                                    }}>{this.getText(user ? user.name : currentUser.displayName)}</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={[styles.textColor, { fontWeight: 'bold', fontSize: 18 }]}>{user ? user.name : currentUser.displayName}</Text>
                                <Text style={[styles.textColor]}>{user ? user.email : currentUser.email}</Text>
                            </View>

                            {
                                user ? (
                                    <Button style={{ alignSelf: 'center' }} transparent onPress={() => this.goToChat()}>
                                        <Icon style={{ color: '#FFF' }} name='chatbubbles' />
                                    </Button>
                                ) : null
                            }

                        </View>

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