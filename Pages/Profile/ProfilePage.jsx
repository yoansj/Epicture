import React, { useState, useEffect } from "react";
import { Text, Button, Image, StyleSheet, View } from "react-native";
import { eraseUserData, getUserData } from "../Authentification/AuthPage";
import { imgurProfileBase } from "../../imgur";
import { Container, Header, Grid, Thumbnail, Spinner } from "native-base";

/**
   * The ProfileDisplayer component displays a imgur profile
   * Props list
   * @param {boolean} loading - Bool to show a loading spinner
   * @param {boolean} showHeader - Bool to display a header on top of the component
   * @param {boolean} renderDisconnect - Bool to render a disconnect button
   * @param {object} userData - Object that contains all the user data (Comes from imgurProfileBase function)
   * @param {function} disconnect - Function to call when disconnecting
   * @example
   * <ProfileDisplayer loading={loading} showHeader={true} userdata={userProfil} renderDisconnect={true} />
   */
  function ProfileDisplayer(props) {
    return (
      <Container style={styles.myBlack}>
        {props.showHeader ? (
          <Header
            rounded
            androidStatusBarColor="black"
            style={{ backgroundColor: "black" }}
          >
            <Text style={{ marginTop: 17, color: "rgb(27,183,110)" }}>
              Profile
            </Text>
          </Header>
        ) : (
          []
        )}
        {props.loading === false ? (
          <Image
            source={{
              uri: props.userdata.cover,
            }}
            style={{ height: 160, width: null }}
          />
        ) : (
          []
        )}
        {props.loading === false ? (
          <Thumbnail
            source={{
              uri: props.userdata.avatar,
            }}
            style={{
              height: 60,
              width: 60,
              marginTop: -60,
              alignSelf: "center",
            }}
          />
        ) : (
          []
        )}
        {props.loading ? (
          <View style={{paddingTop: 250, alignItems: "center"}}>
            <Spinner color="green" size={"large"} />
            <Text style={{ color: "#a7a7a7"}}>
            Loading Profile
            </Text>
          </View>
        ) : (
          []
        )}
        <Grid style={styles.myMiddle}>
          <Text style={{ color: "#a7a7a7", paddingTop: 15 }}>
            {props.loading === false ? "Names" : ""}
          </Text>
          <Text style={styles.myBlack}>
            {props.loading === false ? props.userdata.url : ""}
          </Text>
          <Text style={{ color: "#a7a7a7", paddingTop: 30 }}>
            {props.loading === false ? "About" : ""}
          </Text>
          <Text style={{...styles.myBlack, textAlign: "center"}}>
            {props.loading === false && props.userdata.bio !== ""
              ? decodeURI(props.userdata.bio)
              : props.loading === true ? "" : "Empty bio :("}
          </Text>
          <Text style={{ color: "#a7a7a7", paddingTop: 30 }}>
            {props.loading === false ? "Joined" : ""}
          </Text>
          <Text style={styles.myBlack}>
            {props.loading === false
              ? new Date(props.userdata.created * 1000).toDateString()
              : ""}
          </Text>
          <Text style={{ color: "#a7a7a7", paddingTop: 30 }}>
          {props.loading === false ? "Internet Points" : ""}
          </Text>
          <Text style={styles.myBlack}>
            {props.loading === false ? props.userdata.reputation : ""}
          </Text>
          <Text style={{ color: "#a7a7a7", paddingTop: 30 }}>
            {props.loading === false ? "Notoriety" : ""}
          </Text>
          <Text style={styles.myBlack}>
            {props.loading === false ? props.userdata.reputation_name : ""}
          </Text>
        </Grid>
        {props.renderDisconnect ? (
          <Button
            color="rgb(27,183,110)"
            title="Disconnect"
            onPress={() => eraseUserData().then(props.disconnect())}
          />
        ) : (
          []
        )}
      </Container>
    );
  }

/**
 * ProfilePage component that uses a ProfileDisplayer component to
 * render the currently connected user profile
 * @param {object} route - @see https://reactnavigation.org/docs/params/
 */
export default function ProfilePage({ route }) {
  const { disconnect } = route.params;

  // User data
  const [userProfil, setProfile] = useState("EMPTY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserData().then((value) => {
      imgurProfileBase(value.acess_token, "me").then((value) =>
        {setProfile(value.data); setLoading(false)}
      );
    });
  }, []);

  return (
    <ProfileDisplayer
      loading={loading}
      showHeader={true}
      userdata={userProfil}
      renderDisconnect={true}
      disconnect={disconnect}
    />
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
});
