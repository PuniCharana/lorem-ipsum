
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Sample6 extends Component {

    render() {

        return (
            <View style={styles.container}>

                <Text>Sample6</Text>
                <Button
                    onPress={() => Actions.sample7()}
                    title="Sample 7"
                    color="#841584"
                />

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