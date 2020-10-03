import React from "react";
import AppContainer from './AppContainer'
import { Root } from 'native-base';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
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
  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      )
    } else {
      return (
        <Root>
          <AppContainer />
        </Root>
      )
    }
  }
}


