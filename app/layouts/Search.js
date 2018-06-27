
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Modal,
    ActivityIndicator,
    TouchableHighlight
} from 'react-native';
import firebase from '../Firebase';
import { Container, Content, List, ListItem, Left, Body, Title, Item, Header, Input, Right, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import CustomThumbnail from '../components/CustomThumbnail';
import Utils from '../Utils';
import AppHeader from '../components/AppHeader';
import Globals from '../Globals';

const initialState = {
    error: null,
    isLoading: true,
    chats: [],
    isSearching: false,
    modalVisible: false,
}

export default class Search extends Component {

    state = initialState;

    componentWillMount = () => {

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

    renderChatList = (chats) => {
        return (
            <List>
                {
                    chats.map((chat) => (
                        <ListItem avatar key={chat.chatId} onPress={() => Actions.chatdetails({ chat: chat })}>
                            <Left>
                                <CustomThumbnail text={Utils.getInitials(chat.title)} />
                            </Left>
                            <Body>
                                <Text style={{ fontWeight: 'bold' }}>{chat.title}</Text>
                                <Text style={{ fontSize: 12 }}>Created by: {chat.createdBy}</Text>
                            </Body>
                            <Right />
                        </ListItem>
                    ))
                }
            </List>
        )
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {

        return (

            <Container>
                <AppHeader searchBar rounded>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: '#fff' }} name="arrow-back" />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        {
                            this.state.isSearching ? (
                                <TextInput autoFocus={true} underlineColorAndroid="#e6e6e6" placeholderTextColor="#e6e6e6" selectionColor="#fff" style={{
                                    color: '#fff',
                                    alignSelf: 'stretch',
                                }} placeholder="Search" />
                            ) : <Title>New Group</Title>
                        }
                    </Body>
                    <Right style={{ flex: 1 }}>

                        {
                            this.state.isSearching ? (
                                <Button transparent onPress={() => this.setState({ isSearching: false })}>
                                    <Icon style={{ color: '#fff' }} name="close" />
                                </Button>
                            ) : (
                                    <Button transparent onPress={() => this.setState({ isSearching: true })}>
                                        <Icon style={{ color: '#fff' }} name="search" />
                                    </Button>
                                )
                        }
                    </Right>
                </AppHeader>
                <Content>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => console.log("onRequestClose")}>
                        <View>
                            <ListItem>
                                <Left>
                                    <Text style={{ fontWeight: 'bold' }}>Filter groups</Text>
                                </Left>
                                <Right>
                                    <Button transparent onPress={() => this.setModalVisible(false)}>
                                        <Icon color="#000" name="close" />
                                    </Button>
                                </Right>
                            </ListItem>

                            <Text>TODO</Text>
                        </View>
                    </Modal>
                    <View style={styles.container}>
                        <List>
                            <ListItem icon noBorder style={{ marginTop: 16, marginBottom: 0, borderBottomWidth: 0 }} onPress={() => Actions.creategroup()}>
                                <Left>
                                    <Icon name="people" />
                                </Left>
                                <Body>
                                    <Text>Create New Group</Text>
                                </Body>
                                <Right />
                            </ListItem>

                            <ListItem>
                                <Left>
                                    <Text style={{ fontWeight: 'bold' }}>Dicover groups</Text>
                                </Left>
                                <Right>
                                    <Button transparent onPress={() => this.setModalVisible(true)}>
                                        <Icon color="#000" name="options" />
                                    </Button>
                                </Right>
                            </ListItem>
                        </List>

                        {
                            !this.state.isLoading && !this.state.error ?
                                this.renderChatList(this.state.chats) :
                                this.state.isLoading ?
                                    <ActivityIndicator size="large" color={Globals.COLOR.ACCENT} /> :
                                    this.state.error ?
                                        <Text>{this.state.error}</Text> :
                                        null
                        }
                    </View>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});