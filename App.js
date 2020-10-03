import React from "react";

import { Root } from 'native-base';

import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import AppContainer from './AppContainer'
import Auth, { getUserData } from "./Pages/Authentification/AuthPage.jsx";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, isAuth: false };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    }).catch(function(error) {
      console.log("Font loading error ! " + error.message);
      throw error;
    })
    this.setState({ loading: false });
    getUserData().then(value => {
      console.log(value, "<---- value");
      if (value !== "null" && value !== null)
        this.setAuth();
    }).bind(this);
  }

  setAuth() {
    this.setState({isAuth: true});
  }

  disconnect() {
    this.setState({isAuth: false});
  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      )
    }
    if (!this.state.isAuth) {
    return (
      <Root>
        <Auth setAuth={this.setAuth.bind(this)} />
      </Root>
    )
    }
    if (this.state.isAuth) {
      return (
        <Root>
          <AppContainer disconnect={this.disconnect.bind(this)} />
        </Root>
      )
    }
  }
}


