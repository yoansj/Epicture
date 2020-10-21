import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SearchPage from "./Pages/Search/SearchPage.jsx";
import FavoritesPage from "./Pages/Favorites/FavoritesPage.jsx";
import UploadPage from "./Pages/Upload/UploadPage.jsx";
import SettingsPage from "./Pages/Settings/SettingsPage.jsx";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import { BACKGROUND_COLOR, BACKGROUND_LIGHT, GENERAL_COLOR } from "./Styles.js";

const Tab = createBottomTabNavigator();

const TabBarTheme = {
  colors: {
    primary: GENERAL_COLOR,
    background: BACKGROUND_COLOR,
    card: BACKGROUND_COLOR,
    text: GENERAL_COLOR,
    border: GENERAL_COLOR,
    notification: GENERAL_COLOR,
  },
};

/**
 * The App Container component is displayed once the user is logged into the application
 * It displays a Tab Navigator containing all the pages of the application
 * It's this component that calls each Component representing the Pages
 * Takes a disconnect props that is a function that is called to disconnect the user
 * @param {*} props 
 */
export default function AppContainer(props) {
  return (
    <NavigationContainer theme={TabBarTheme}>
      <Tab.Navigator
        initialRouteName="Search"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Search") {
              return <Ionicons name="ios-search" size={size} color={color} />;
            } else if (route.name === "Profile") {
              return (
                <MaterialCommunityIcons
                  name="face-profile"
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "Favorites") {
              if (focused)
                return (
                  <MaterialIcons name="favorite" size={size} color={color} />
                );
              else
                return (
                  <MaterialIcons
                    name="favorite-border"
                    size={size}
                    color={color}
                  />
                );
            } else if (route.name === "Upload") {
              if (focused)
                return (
                  <Ionicons name="ios-add-circle" size={size} color={color} />
                );
              else
                return (
                  <Ionicons
                    name="ios-add-circle-outline"
                    size={size}
                    color={color}
                  />
                );
            } else if (route.name === "Settings") {
              return (
                <Ionicons name="ios-cog" size={size} color={color} />
              )
            }
          },
        })}
      >
        <Tab.Screen name="Upload" component={UploadPage} />
        <Tab.Screen name="Favorites" component={FavoritesPage} />
        <Tab.Screen name="Search" component={SearchPage} />
        <Tab.Screen name="Profile" component={ProfilePage} initialParams={{disconnect: props.disconnect}} />
        <Tab.Screen name="Settings" component={SettingsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
