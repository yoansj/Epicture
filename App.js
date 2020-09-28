import React from 'react';
import { StyleSheet, View} from 'react-native';
import Auth from './Components/Auth.jsx';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchPage from './Pages/Search/SearchPage.jsx';

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator theme={DarkTheme} initialRouteName="Search">
        <Tab.Screen name="Search" component={SearchPage} />
        <Tab.Screen name="Auth" component={Auth} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});