
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import firebase from '../Firebase';
import { Container, List, ListItem, Left, Body, Button, Title, Right, Fab, Icon } from 'native-base';

import { Actions } from 'react-native-router-flux';
import Utils from '../Utils';
import moment from 'moment';
import CustomThumbnail from '../components/CustomThumbnail';
import Globals from '../Globals';

const initialState = {
    error: null,
    isLoading: true,
    userChats: [],
    isSearching: false
}

const CustomHeader = (props) => (
    <AppHeader>
        <Left style={{ flex: 1 }}>
            <Button iconLeft transparent onPress={() => Actions.profile()}>
                <Icon style={{ color: '#FFF' }} name='person' />
            </Button>
        </Left>

        <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            {
                props.isSearching ? (
                    <TextInput
                        onChangeText={(text) => props.onSearch(text)}
                        autoFocus={true}
                        underlineColorAndroid="#e6e6e6"
                        placeholderTextColor="#e6e6e6"
                        selectionColor="#fff"
                        style={{
                            color: '#fff',
                            alignSelf: 'stretch',
                        }} placeholder="Search" />
                ) : <Title style={{ color: '#FFF' }}>Besocial</Title>
            }
        </Body>

        <Right style={{ flex: 1 }}>

            {
                props.isSearching ? (
                    <Button transparent onPress={() => props.updateIsSearching(false)}>
                        <Icon style={{ color: '#fff' }} name="close" />
                    </Button>
                ) : (
                        <Button transparent onPress={() => props.updateIsSearching(true)}>
                            <Icon style={{ color: '#fff' }} name="search" />
                        </Button>
                    )
            }
        </Right>

    </AppHeader>
)

export default class Chats extends Component {

    state = initialState;

    componentDidMount = () => {
        console.log("componentDidMount");
        var user = firebase.auth().currentUser;
        firebase.database().ref("userChats/" + user.uid).on("value", (idSnapshot) => {
            console.log("idSnapshot", idSnapshot);
            idSnapshot.forEach((chatsSnapshot) => {
                firebase.database().ref("chats/" + chatsSnapshot.key).on("value", (snapshot) => {

                    var previousChats = this.state.userChats;
                    var index = previousChats.map(x => x.chatId).indexOf(snapshot.val().chatId)
                    if (index < 0) {
                        previousChats.push(snapshot.val());
                    } else {
                        previousChats[index] = snapshot.val();
                    }
                    this.setState({
                        isLoading: false,
                        userChats: previousChats
                    })
                }, (error) => {
                    this.setState({
                        isLoading: false,
                        error: error.message
                    })
                })
            });
            if (!idSnapshot.val()) {
                this.setState({
                    isLoading: false,
                    error: "No chats yet!\nJoin a group to start chatting by clicking new message button on bottom right corner"
                })
            }
        }, (error) => {
            this.setState({
                isLoading: false,
                error: error.message
            })
        });
    }

    getRelativeTime = (unix) => {
        moment.updateLocale('en', {
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: 'a few sec',
                ss: '%d secs',
                m: "a min",
                mm: "%d mins",
                h: "an hr",
                hh: "%d hrs",
                d: "a day",
                dd: "%d day",
                M: "a m",
                MM: "%d m",
                y: "a y",
                yy: "%d y"
            }
        });
        return moment.unix(unix / 1000).fromNow()
    }

    updateIsSearching = (isSearching) => {
        this.setState({
            isSearching: isSearching
        })
    }

    onSearch = (searchText) => {

    }

    render() {

        var user = firebase.auth().currentUser;

        var mUserChats = this.state.userChats;
        mUserChats.sort((chatA, chatB) => chatA.lastUpdated > chatB.lastUpdated ? -1 : 1)

        return (
            <Container>
                <CustomHeader
                    isSearching={this.state.isSearching}
                    updateIsSearching={this.updateIsSearching}
                    onSearch={this.onSearch}
                />
                <View style={{ flex: 1 }}>

                    {
                        this.state.isLoading ? <ActivityIndicator size="large" color={Globals.COLOR.ACCENT} /> : this.state.error ? <Text style={{
                            alignSelf: 'center',
                            textAlign: 'center',
                            margin: 50
                        }}>{this.state.error}</Text> : null
                    }

                    {
                        (!this.state.isLoading && !this.state.error) ? (
                            <List>
                                {
                                    mUserChats.map((chat) => {
                                        return chat.type === "personal" ? (

                                            <ListItem
                                                avatar
                                                key={chat.chatId}
                                                onPress={() => Actions.userchat({ chat: chat })}
                                            >
                                                <Left>
                                                    <CustomThumbnail text={Utils.getInitials(Utils.getOtherUser(user.displayName, chat.title))} />
                                                </Left>
                                                <Body>
                                                    <Text style={{ fontWeight: 'bold' }}>{Utils.getOtherUser(user.displayName, chat.title)}</Text>
                                                    <Text style={{ fontSize: 12 }}>{chat.lastMessage}</Text>
                                                </Body>
                                                <Right>
                                                    <Text note>{this.getRelativeTime(chat.lastUpdated)}</Text>
                                                </Right>
                                            </ListItem>
                                        ) : (
                                                <ListItem
                                                    avatar
                                                    key={chat.chatId}
                                                    onPress={() => Actions.chat({ chat: chat })}
                                                >
                                                    <Left>
                                                        <CustomThumbnail text={Utils.getInitials(chat.title)} />
                                                    </Left>
                                                    <Body>
                                                        <Text style={{ fontWeight: 'bold' }}>{chat.title}</Text>
                                                        <Text style={{ fontSize: 12 }}>{chat.lastMessage}</Text>
                                                    </Body>
                                                    <Right>
                                                        <Text note>{this.getRelativeTime(chat.lastUpdated)}</Text>
                                                    </Right>
                                                </ListItem>
                                            )
                                    })
                                }
                            </List>
                        ) : null
                    }

                    <Fab
                        active={true}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: Globals.COLOR.PRIMARY }}
                        position="bottomRight"
                        onPress={() => Actions.search()}>
                        <Icon name="create" />
                    </Fab>

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
    },
});