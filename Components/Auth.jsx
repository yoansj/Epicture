import React, { useState } from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { CLIENT_ID } from "../imgur.js";
import AsyncStorage from '@react-native-community/async-storage';

export const saveUserData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('user_data', jsonValue)
  } catch (e) {
    console.error("Error encountered while saving user data");
  }
}

export const getUserData = async () => {
try {
  const jsonValue = await AsyncStorage.getItem('user_data')
  return jsonValue != null ? JSON.parse(jsonValue) : null;
} catch(e) {
  console.error("Error encountered while reading user data");
}
}

function Auth() {

  const [userData, setUserData] = useState(null);

  function getToken(navState) {
    const url = navState.url + '&'; // Add & to the url so that the last regex doesnt fail

    if (
      url.search("state=93") !== -1 &&
      url !==
        `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=93`
    ) {
      var acess_token_re = /access_token=(.*?)&/;
      var expiration_re = /expires_in=(.*?)&/;
      var refresh_token_re = /refresh_token=(.*?)&/;
      var username_re = /account_username=(.*?)&/;
      var id_re = /account_id=(.*?)&/;

      console.log("Token found !");
      // if added so that expo doesnt generate warning beacause url is null
      if (url !== null && url !== "") {
        var userData = {
          acess_token: acess_token_re.exec(url)[1],
          expiration_token: expiration_re.exec(url)[1],
          refresh_token: refresh_token_re.exec(url)[1],
          username: username_re.exec(url)[1],
          id: id_re.exec(url)[1]
        };
        saveUserData(userData);
        console.log(userData);
        setUserData(userData);
    }
    }
  }

  return (
    <View>
      {userData === null ?
            <WebView
            onNavigationStateChange={(navState) => getToken(navState)}
            source={{
              uri: `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=93`,
            }}
          /> : []
      }
      {userData !== null ?
        <Text>Welcome to your profilee !</Text> : []
      }
    </View>
  );
}

export default Auth;
