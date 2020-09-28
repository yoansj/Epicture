import React from "react";
import { View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { CLIENT_ID } from "../imgur.js";

function Auth() {
  function getToken(navState) {
    const url = navState.url + '&'; //Add & to the url so that the last regex doesnt fail

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
      var userData = {
        acess_token: acess_token_re.exec(url)[1],
        expiration_token: expiration_re.exec(url)[1],
        refresh_token: refresh_token_re.exec(url)[1],
        username: username_re.exec(url)[1],
        id: id_re.exec(url)[1]
      };
      console.log(userData);
    }
  }

  return (
    <WebView
      onNavigationStateChange={(navState) => getToken(navState)}
      source={{
        uri: `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=93`,
      }}
    />
  );
}

export default Auth;
