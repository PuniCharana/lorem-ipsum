import React from 'react';
import { View, StatusBar } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import GLOBALS from './Globals'

import Splash from './layouts/Splash';
import Login from './layouts/Login';
import Chats from './layouts/Chats';
import Create from './layouts/Create';
import Chat from './layouts/Chat';
import Search from './layouts/Search';
import ChatDetails from './layouts/ChatDetails';
import Profile from './layouts/Profile';
import UserChat from './layouts/UserChat';
import Signup from './layouts/Signup';

export default App = () => {

  const onBackAndroid = () => {
    return Actions.pop(); // Return true to stay, or return false to exit the app.
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={GLOBALS.COLOR.PRIMARYDARK}
        barStyle="light-content"
      />
      <Router
        navigationBarStyle={{ backgroundColor: GLOBALS.COLOR.PRIMARY }}
        titleStyle={{ textAlign: 'center', flex: 1 }}
        tintColor={GLOBALS.COLOR.WHITE}
        sceneStyle={{ backgroundColor: '#fff' }}
        backAndroidHandler={onBackAndroid}
      >
        <Scene key="root">
          <Splash key="splash" hideNavBar={true} initial component={Splash} />
          <Scene key="login" hideNavBar={true} component={Login} />
          <Scene key="chats" hideNavBar={true} title="Chats" component={Chats} />
          <Scene key="creategroup" hideNavBar={true} title="Create" component={Create} />
          <Scene key="chat" hideNavBar={true} title="Chat" component={Chat} />
          <Scene key="search" hideNavBar={true} title="Search" component={Search} />
          <Scene key="chatdetails" hideNavBar={true} title="Chat Details" component={ChatDetails} />
          <Scene key="profile" hideNavBar={true} title="Profile" component={Profile} />
          <Scene key="userchat" hideNavBar={true} title="User Chat" component={UserChat} />
          <Scene key="signup" hideNavBar={true} title="Signup" component={Signup} />

        </Scene>
      </Router>
    </View>
  );

}