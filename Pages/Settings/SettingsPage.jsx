import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Button, Switch } from "react-native";
import { Container, Header, Spinner, Input, Toast } from "native-base";
import { getUserData } from '../Authentification/AuthPage';
import { imgurAccountChangeSettings, imgurAccountSettings, imgurProfileBase } from '../../imgur';
import { generalStyle, GENERAL_COLOR, BACKGROUND_LIGHT, BACKGROUND_COLOR, TEXT_COLOR } from "../../Colors";

function SettingsDisplayer(props) {
  const [newBio, setNewBio] = useState(props.bio);
  const [publicImages, setPublicImages] = useState(props.publicImages);
  const [messaging, setMessaging] = useState(props.messaging_enabled);
  const [albumPrivacy, setAlbumPrivacy] = useState(props.album_privacy);
  const [username, setUsername] = useState(props.username);
  const [mature, setMature] = useState(props.show_mature);
  const [newsletter, setNewsletter] = useState(props.newsletter);

  function confirmChanges() {
    let alphanum = /^[a-z0-9]+$/i;

    if (alphanum.exec(username) != null && username.length >= 4 && username.length <= 63) {
      getUserData().then((value) => {
        imgurAccountChangeSettings(
          value.acess_token,
          newBio,
          publicImages,
          messaging,
          albumPrivacy,
          username,
          mature,
          newsletter
        ).then((rep) => {
          if (rep.data) {
            Toast.show({
              text: "Settings changed succesfully",
              buttonText: "Cool",
              type: "success",
              duration: 5000,
            })
          } else {
            Toast.show({
              text: "Couldn't change your settings",
              buttonText: "Okay",
              type: 'danger',
              duration: 5000,
            })
          }
        });
      });
    } else {
      Toast.show({
        text: "Invalid username",
        buttonText: "Okay",
        type: 'danger',
        duration: 5000,
      })
    }
  }

  return (
    <Container style={generalStyle.primaryColor}>
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          justifyContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
        }}
      >
        Change your bio
      </Text>
      <Input
        style={{
          color: GENERAL_COLOR,
          flex: 0,
          alignSelf: "center",
          textAlign: "center",
          maxHeight: 100,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderColor: GENERAL_COLOR,
        }}
        defaultValue={newBio}
        onChangeText={(text) => setNewBio(text)}
        multiline
        placeholder="What can you say about you ?"
      />
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          justifyContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
        }}
      >
        Your images are {publicImages ? "public" : "private"} by default
      </Text>
      <Switch
        style={{ alignSelf: "center" }}
        trackColor={{ false: "#0C0C0C", true: generalStyle.primarySetting.backgroundColor }}
        thumbColor={publicImages ? generalStyle.primarySetting.backgroundColor : "#0C0C0C"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setPublicImages(!publicImages)}
        value={publicImages}
      />
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          justifyContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
        }}
      >
        Allow private messages ?
      </Text>
      <Switch
        style={{ alignSelf: "center" }}
        trackColor={{ false: "#0C0C0C", true: generalStyle.primarySetting.backgroundColor }}
        thumbColor={messaging ? generalStyle.primarySetting.backgroundColor : "#0C0C0C"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setMessaging(!messaging)}
        value={messaging}
      />
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          marginBottom: 8,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        Default privacy level of the albums created
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Pressable
          style={{ paddingRight: 20 }}
          onPress={() => setAlbumPrivacy("hidden")}
        >
          <Text
            style={{
              color:
                albumPrivacy === "hidden"
                  ? generalStyle.primarySetting.backgroundColor
                  : "#0C0C0C",
              fontSize: 20,
            }}
          >
            Hidden
          </Text>
        </Pressable>
        <Pressable
          style={{ paddingRight: 20, paddingLeft: 20 }}
          onPress={() => setAlbumPrivacy("public")}
        >
          <Text
            style={{
              color:
                albumPrivacy === "public"
                  ? generalStyle.primarySetting.backgroundColor
                  : "#0C0C0C",
              fontSize: 20,
            }}
          >
            Public
          </Text>
        </Pressable>
        <Pressable
          style={{ paddingLeft: 20 }}
          onPress={() => setAlbumPrivacy("secret")}
        >
          <Text
            style={{
              color:
                albumPrivacy === "secret"
                  ? generalStyle.primarySetting.backgroundColor
                  : "#0C0C0C",
              fontSize: 20,
            }}
          >
            Secret
          </Text>
        </Pressable>
      </View>
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          justifyContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
        }}
      >
        Your username
      </Text>
      <Input
        style={{
          color: generalStyle.primarySetting.backgroundColor,
          flex: 0,
          alignSelf: "center",
          textAlign: "center",
        }}
        defaultValue={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="between 4 and 63 alphanumeric characters please"
      />
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          justifyContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
        }}
      >
        Show mature content ?
      </Text>
      <Switch
        style={{ alignSelf: "center" }}
        trackColor={{ false: "#0C0C0C", true: generalStyle.primarySetting.backgroundColor }}
        thumbColor={mature ? generalStyle.primarySetting.backgroundColor : "#0C0C0C"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setMature(!mature)}
        value={mature}
      />
      <Text
        style={{
          color: "#0C0C0C",
          marginTop: 17,
          justifyContent: "center",
          alignSelf: "center",
          paddingBottom: 10,
        }}
      >
        Subscribe to imgur email newsletter ?
      </Text>
      <Switch
        style={{ alignSelf: "center" }}
        trackColor={{ false: "#0C0C0C", true: generalStyle.primarySetting.backgroundColor }}
        thumbColor={newsletter ? generalStyle.primarySetting.backgroundColor : "#0C0C0C"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setNewsletter(!newsletter)}
        value={newsletter}
      />
      <View
        style={{
          paddingTop: 10,
          position: "absolute",
          bottom: 30,
          alignSelf: "center",
        }}
      >
        <Button
          color= {generalStyle.primarySetting.backgroundColor}
          title="Confirm changes"
          onPress={() => {
            confirmChanges();
          }}
        />
      </View>
    </Container>
  );
}

/**
 * This component displays the settings page
 * It displays a screen so that the logged in user can see
 * and change his settings
 * @see https://apidocs.imgur.com/#a94d108b-d6e3-4e68-9521-47ea79501c85
 */
export default function SettingsPage() {

  // Know if page is loading
  const [loading, setLoading] = useState(true);
  // Object containing user settings
  const [settings, setSettings] = useState(null);
  // Object containing user imgur data
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getUserData().then((value) => {
      imgurAccountSettings(value.acess_token).then((settings) => {
        setSettings(settings.data);
        imgurProfileBase(value.acess_token, "me").then((value) => {
          setUserData(value.data);
          setLoading(false);
        });
      });
    });
  }, []);

  return (
    <Container style={generalStyle.primaryColor}>
      <Header
        rounded
        androidStatusBarColor={GENERAL_COLOR}
        style={{ backgroundColor: GENERAL_COLOR }}
      >
        <Text style={{ marginTop: 17, color: BACKGROUND_COLOR}}>
          Settings
        </Text>
      </Header>
      {loading === true ? (
        <View style={{ paddingTop: 250, alignItems: "center" }}>
          <Spinner color={GENERAL_COLOR} size={"large"} />
          <Text style={{...generalStyle.primaryWhite, backgroundColor: BACKGROUND_LIGHT}}>Loading your settings</Text>
        </View>
      ) : (
        <SettingsDisplayer
          bio={userData.bio}
          publicImages={settings.public_images}
          messaging={settings.messaging_enabled}
          album_privacy={settings.album_privacy}
          username={settings.account_url}
          show_mature={settings.show_mature}
          newsletter={settings.newsletter_subscribed}
        />
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
    color: "#0C0C0C"
  },
  myPickerGreen:{
    color: 'rgb(27,183,110)',
    width: undefined
  },
});