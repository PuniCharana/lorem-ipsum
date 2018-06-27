
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Globals from '../Globals';
import { Container, Content, Left, Body, Textarea, Title, List, ListItem, CheckBox, Text, Right, Icon, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

const initialState = {
    error: null,
    title: null,
    location: null,
    public: true,
    description: null,
    autocompletePlaces: [],
}

export default class Create extends Component {
    state = initialState;

    createNewGroup = () => {
        console.log(this.state);
        if (this.state.title && this.state.location && this.state.description) {
            var chatRef = firebase.database().ref("chats");

            var user = firebase.auth().currentUser;
            var chatId = chatRef.push().key;

            var chat = {};
            chat.title = this.state.title;
            chat.location = this.state.location;
            chat.locationId = this.state.locationId;
            chat.description = this.state.description;
            chat.createdAt = Date.now().toString();
            chat.lastUpdated = Date.now().toString();
            chat.lastMessage = "tap to chat"
            chat.type = this.state.public ? "public" : "private";
            chat.chatId = chatId;
            chat.createdBy = user.displayName;
            chat.createdById = user.uid

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
                    Actions.popTo("chats")
                }, (error) => {
                    console.log(error);
                });

        } else {
            console.log("Title & Location cannot be empty");
            this.setState({
                error: "Title, location & description cannot be empty"
            })
        }
    }

    changeMode = () => {
        this.setState({
            public: !this.state.public
        })
    }

    getPlaces = (text) => {

        // https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Vict&types=geocode&language=fr&key=YOUR_API_KEY


        var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text + '&key=AIzaSyAmXYP7FoNnYafHd2jB0AyQHj3d4-YHDkI'

        fetch(url).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    autocompletePlaces: responseJson.predictions
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    selectPlace = (place) => {
        this.setState({
            location: place.description,
            locationId: place.id,
            autocompletePlaces: []
        })
    }

    renderAutoComplete = (places = []) => {
        return (
            <List>
                {
                    places.map((place) => (
                        <ListItem key={place.id} onPress={() => this.selectPlace(place)}>
                            <Text>{place.description}</Text>
                        </ListItem>
                    ))
                }
            </List>
        )
    }

    render() {

        return (

            <Container>
                <AppHeader>
                    <Left style={{ flex: 1 }}>
                        <Button iconLeft transparent onPress={() => Actions.pop()}>
                            <Icon style={{ color: '#fff' }} name='arrow-back' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={{ color: Globals.COLOR.WHITE }} >Create</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </AppHeader>
                <Content>

                    <View style={styles.container}>

                        <TextInput
                            style={[styles.input, { marginTop: 10, width: 200, padding: 8, height: 40, }]}
                            onChangeText={(title) => this.setState({ title, error: null })}
                            value={this.state.title}
                            placeholder="Title"
                        />

                        <TextInput
                            style={[styles.input, { marginTop: 10, width: 200, padding: 8, height: 40, }]}
                            value={this.state.location}
                            onChangeText={(location) => {
                                this.setState({ location, error: null })
                                this.getPlaces(location);
                            }}
                            value={this.state.location}
                            placeholder="Location"
                        />

                        {
                            this.renderAutoComplete(this.state.autocompletePlaces)
                        }

                        <Textarea
                            style={[styles.input, { marginTop: 10, width: 200, padding: 8, }]}
                            onChangeText={(description) => this.setState({ description, error: null })}
                            value={this.state.description}
                            selectionColor={Globals.COLOR.BLACK}
                            placeholderTextColor={Globals.COLOR.GRAY}
                            rowSpan={3}
                            placeholder="Description"
                        />

                        <ListItem noBorder style={{ width: 200, borderBottomWidth: 0 }}>
                            <CheckBox checked={!this.state.public} onPress={() => this.changeMode()} />
                            <Body>
                                <Text> Make Private</Text>
                            </Body>
                        </ListItem>

                        {
                            this.state.error ? <Text style={{
                                padding: 16,
                                width: 220,
                                color: 'red'
                            }}>{this.state.error}</Text> : null
                        }

                        <View style={{ width: 220, marginTop: 10,}}>
                            <TouchableOpacity onPress={() => this.createNewGroup()} style={{ 
                                alignSelf: 'flex-end',
                                padding: 10,
                                borderRadius: 50,
                                backgroundColor: Globals.COLOR.PRIMARY
                             }}>
                                <Text style={{color: '#fff'}}>Create</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Content>
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

    input: { color: Globals.COLOR.BLACK, borderBottomWidth: 1, borderBottomColor: Globals.COLOR.GRAY }
});