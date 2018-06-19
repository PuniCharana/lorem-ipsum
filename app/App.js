import React from 'react';
import { View, StatusBar } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';

import Login from './layouts/Login';
import Home from './layouts/Home';
import Chats from './layouts/Chats';
import Create from './layouts/Create';
import Chat from './layouts/Chat';
import Search from './layouts/Search';
import ChatDetails from './layouts/ChatDetails';
import Profile from './layouts/Profile';

import Sample1 from './test/Sample1';
import Sample2 from './test/Sample2';
import Sample3 from './test/Sample3';
import Sample4 from './test/Sample4';
import Sample5 from './test/Sample5';
import Sample6 from './test/Sample6';
import Sample7 from './test/Sample7';
import Sample8 from './test/Sample8';
import Sample9 from './test/Sample9';
import Sample10 from './test/Sample10';

export default App = () => {

  const onBackAndroid = () => {
    return Actions.pop(); // Return true to stay, or return false to exit the app.
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
      />
      <Router tintColor="#841584" sceneStyle={{ backgroundColor: '#fff' }} backAndroidHandler={onBackAndroid}>
        <Scene key="root">
          <Scene key="login" hideNavBar={true} component={Login} />
          <Scene key="home" title="Home" component={Home} />
          <Scene key="chats" title="Chats" component={Chats} />
          <Scene key="creategroup" title="Create" component={Create} />
          <Scene key="chat" component={Chat} />
          <Scene key="search" title="Search" component={Search} />
          <Scene key="chatdetails" component={ChatDetails} />
          <Scene key="profile" component={Profile} />


          <Scene key="sample1" title="Sample1" component={Sample1} />
          <Scene key="sample2" title="Sample2" component={Sample2} />
          <Scene key="sample3" title="Sample3" component={Sample3} />
          <Scene key="sample4" title="Sample4" component={Sample4} />
          <Scene key="sample5" title="Sample5" component={Sample5} />
          <Scene key="sample6" title="Sample6" component={Sample6} />
          <Scene key="sample7" title="Sample7" component={Sample7} />
          <Scene key="sample8" title="Sample8" component={Sample8} />
          <Scene key="sample9" title="Sample9" component={Sample9} />
          <Scene key="sample10" title="Sample10" component={Sample10} />

        </Scene>
      </Router>
    </View>
  );

}