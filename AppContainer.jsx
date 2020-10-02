import React from "react";

import {
  NavigationContainer,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SearchPage from "./Pages/Search/SearchPage.jsx";
import Auth from "./Components/Auth.jsx";
import FavoritesPage from "./Pages/Favorites/FavoritesPage.jsx";
import UploadPage from "./Pages/Upload/UploadPage.jsx";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const MyDarkGreen = {
  colors: {
    primary: 'rgb(27, 183, 110)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};

export default function AppContainer() {
  return (
    <NavigationContainer theme={MyDarkGreen}>
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
            }
          },
        })}
      >
        <Tab.Screen name="Search" component={SearchPage} />
        <Tab.Screen name="Favorites" component={FavoritesPage} />
        <Tab.Screen name="Upload" component={UploadPage} />
        <Tab.Screen name="Profile" component={Auth} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
