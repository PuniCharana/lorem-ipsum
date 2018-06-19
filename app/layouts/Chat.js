
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';


export default class Chat extends Component {

    componentWillMount() {
        Actions.refresh({ title: this._renderTitle });
    }

    _renderTitle = () => {
        return (
            <TouchableOpacity onPress={() => Actions.replace("chatdetails", { chat: this.props.chat })}>
                <Text style={{ color: '#841584' }}>{this.props.chat.title}</Text>
                <Text style={{ fontSize: 10, color: '#841584' }}>tap here for details</Text>
            </TouchableOpacity>
        );
    };

    render() {

        return (
            <View style={styles.container}>
                <Text>Chat</Text>
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