import React from "react";

import { WebView } from "react-native-webview";
import AsyncStorage from '@react-native-community/async-storage';

import { CLIENT_ID } from "../../imgur.js";

/**
 * This function is used to save the user data when
 * the user connects to the application
 * It is called mainly by the AuthPage function
 * @param {object} value - Json serializeable object
 */
export const saveUserData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('user_data', jsonValue)
  } catch (e) {
    console.error("Error encountered while saving user data");
  }
}

/**
 * This function is used to get the user data that was saved
 * when user logged in the app
 * The user data can be "null" when his data was erased
 * Most of the time its data is an object :
 * @example
 *   {
      acess_token: string,
      expiration_token: number,
      refresh_token: string,
      username: string,
      id: string,
      date: Date
    }
 */
export const getUserData = async () => {
try {
  const jsonValue = await AsyncStorage.getItem('user_data')
  if (jsonValue === "null") return (jsonValue);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
} catch(e) {
  console.error("Error encountered while reading user data");
}
}

/**
 * This function wipes user data, it is mainly used
 * to disconnect the user from the app
 */
export const eraseUserData = async () => {
  try {
    await AsyncStorage.setItem('user_data', "null")
  } catch (e) {
    console.error("Error encountered while saving user data");
  }
}

/**
 * This component renders the authorisation page
 * This page mainly displays a WebView for the user to connect
 * This page is displayed as long as the user is not connected
 * once the user connects, he can access the application
 * @param {*} props 
 */
function AuthPage(props) {

  async function getToken(navState) {
    const url = await navState.url + '&'; // Add & to the url so that the last regex doesnt fail

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
          id: id_re.exec(url)[1],
          date: new Date().toJSON()
        };
        
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
