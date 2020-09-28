import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { CLIENT_ID } from '../imgur.js';

function Auth() {
    return (
        <WebView source={{ uri: `https://api.imgur.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&state=93`}} />
    )
}

export default Auth;