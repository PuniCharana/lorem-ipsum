import React from 'react';
import { View, Text } from 'react-native';
import Globals from '../Globals';

export default CustomThumbnail = ({ text }) => {
    return (
        <View style={{
            padding: 10,
            width: 44,
            height: 44,
            backgroundColor: Globals.COLOR.PRIMARY,
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 50
        }}>
            <Text style={{ flex: 1, color: Globals.COLOR.WHITE, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center' }}>{text}</Text>
        </View>
    );
}