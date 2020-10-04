import React from "react";

import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-community/async-storage';

import { CLIENT_ID } from "../../imgur.js";

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
  if (jsonValue === "null") return (jsonValue);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
} catch(e) {
  console.error("Error encountered while reading user data");
}
}

export const eraseUserData = async () => {
  try {
    await AsyncStorage.setItem('user_data', "null")
  } catch (e) {
    console.error("Error encountered while saving user data");
  }
}

function AuthPage(props) {

  function getToken(navState) {
    const url = navState.url + '&'; // Add & to the url so that the last regex doesnt fail

    if (
      url.search("state=93") !== -1 &&
      url !==
        `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=93`
    ) {

      // if added so that expo doesnt generate warning beacause url is null
      if (url !== null && url !== undefined) {
        let acess_token_re = /access_token=(.*?)&/;
        let expiration_re = /expires_in=(.*?)&/;
        let refresh_token_re = /refresh_token=(.*?)&/;
        let username_re = /account_username=(.*?)&/;
        let id_re = /account_id=(.*?)&/;

        let userData = {
          acess_token: acess_token_re.exec(url)[1],
          expiration_token: expiration_re.exec(url)[1],
          refresh_token: refresh_token_re.exec(url)[1],
          username: username_re.exec(url)[1],
          id: id_re.exec(url)[1]
        };
        console.log(userData);
        console.log("Logged in !");
        saveUserData(userData).then(value => props.setAuth());
    }
    }
  }

  return (
    <WebView
      incognito
      onNavigationStateChange={(navState) => getToken(navState)}
      source={{
        uri: `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=93`,
      }}
    />
  );
}

export default AuthPage;
