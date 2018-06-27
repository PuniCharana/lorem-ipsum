import React from 'react';

import { Header } from 'native-base';
import GLOBALS from '../Globals';

export default AppHeader = (props) => {

    return (
        <Header
            iosBarStyle="light-content"
            androidStatusBarColor={GLOBALS.COLOR.PRIMARYDARK}
            style={{
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 0,
                borderBottomWidth: 0,
                elevation: 0,
                backgroundColor: GLOBALS.COLOR.PRIMARY,
                alignContent: 'center',
                alignItems: 'center'
            }}
            {...props}
        >
            {props.children}
        </Header>
    );
}
