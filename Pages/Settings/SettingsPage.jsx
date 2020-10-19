import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, Button } from "react-native";
import { Container, Header, Grid, Thumbnail, Spinner, Input } from "native-base";
import { getUserData } from '../Authentification/AuthPage';
import { imgurAccountSettings, imgurProfileBase } from '../../imgur';

/**
 * This component displays the settings page
 * It displays a screen so that the logged in user can see
 * and change his settings
 * @see https://apidocs.imgur.com/#a94d108b-d6e3-4e68-9521-47ea79501c85
 */
export default function SettingsPage() {

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [userData, setUserData] = useState(null);

  const [bio, setBio] = useState("");

  useEffect(() => {
    getUserData().then((value) => {
      imgurAccountSettings(value.acess_token).then((settings) => {
        setSettings(settings.data);
        imgurProfileBase(value.acess_token, "me").then((value) => {
          setUserData(value.data);
          setBio(value.data.bio);
          setLoading(false);
        });
      });
    });
  }, []);

  function SettingsDisplayer() {
    return (
      <Container style={styles.myBlack}>
        <Text
          style={{
            color: styles.myGreen.backgroundColor,
            marginTop: 17,
            justifyContent: "center",
          }}
        >
          Change your bio
        </Text>
        <Input
          style={{ color: "white", flex: 0, alignSelf: "center" }}
          value={bio}
          onChangeText={(text) => setBio(text)}
          multiline
          placeholder="Description of your album"
        />
      </Container>
    );
  }

  return (
    <Container style={styles.myBlack}>
      <Header
        rounded
        androidStatusBarColor="black"
        style={{ backgroundColor: "black" }}
      >
        <Text style={{ marginTop: 17, color: styles.myGreen }}>
          Settings
        </Text>
      </Header>
      {loading === true ? (
        <View style={{ paddingTop: 250, alignItems: "center" }}>
          <Spinner color="green" size={"large"} />
          <Text style={styles.myGrey}>Loading your settings</Text>
        </View>
      ) : (
        <SettingsDisplayer />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  myMiddle: {
    alignItems: "center",
    flexDirection: "column",

    backgroundColor: "rgb(18,18,18)",
  },
  myMiddle_info: {
    paddingTop: -80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(18,18,18)",
  },
  myGreen: {
    backgroundColor: "rgb(27,183,110)",
  },
  myBlack: {
    backgroundColor: "rgb(18,18,18)",
    color: "rgb(27,183,110)",
  },
  myGrey: {
    color: "#a7a7a7"
  }
});