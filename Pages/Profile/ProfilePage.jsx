import React, { useState, useEffect } from "react";
import { Text, Button, Image, StyleSheet, ImageBackground } from "react-native";
import { eraseUserData, getUserData } from "../Authentification/AuthPage";
import { imgurProfileBase } from "../../imgur";
import { Container, Header, Grid, Thumbnail } from "native-base";

export default function ProfilePage({ route }) {
  const greyFont = "#a7a7a7";
  const { disconnect } = route.params;
  // the user data
  const [userData, setUserData] = useState("EMPTY");
  const [userProfil, setProfile] = useState("EMPTY");

  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurProfileBase(value.acess_token, value.username).then((value) =>
        setProfile(value.data)
      );
    });
  }, []);

  function ProfileDisplayer(props) {
    return (
      <Container style={styles.myBlack}>
      <Header
        rounded
        androidStatusBarColor="black"
        style={{ backgroundColor: "black" }}
      >
        <Text style={{ marginTop: 17, color: "rgb(27,183,110)" }}>
          Profile{" "}
        </Text>
      </Header>
      <ImageBackground
        source={{
          uri: userProfil.cover,
        }}
        style={{ flex: 1, resizeMode: "cover", justifyContent: 'center'}}
        blurRadius={2}
      >

      </ImageBackground>
    </Container>
    )
  }

  return (
    <Container style={styles.myBlack}>
      <Header
        rounded
        androidStatusBarColor="black"
        style={{ backgroundColor: "black" }}
      >
        <Text style={{ marginTop: 17, color: "rgb(27,183,110)" }}>
          Profile{" "}
        </Text>
      </Header>
      <ImageBackground
        source={{
          uri: userProfil.cover,
        }}
        style={{ flex: 1, resizeMode: "cover", justifyContent: 'center'}}
        blurRadius={0.5}
      >
      <Button
        color="rgb(27,183,110)"
        title="Disconnect"
        onPress={() => eraseUserData().then(disconnect())}
      />
      </ImageBackground>
    </Container>
  )

  return (
    <Container style={styles.myBlack}>
      <Header
        rounded
        androidStatusBarColor="black"
        style={{ backgroundColor: "black" }}
      >
        <Text style={{ marginTop: 17, color: "rgb(27,183,110)" }}>
          Profile{" "}
        </Text>
      </Header>
      <ImageBackground
        source={{
          uri: userProfil.cover,
        }}
        style={{ flex: 1, resizeMode: "cover", justifyContent: 'center'}}
      >

      </ImageBackground>
      <Image
        source={{
          uri: userProfil.cover,
        }}
        style={{ height: 160, width: null }}
      />

      <Thumbnail
        source={{
          uri: userProfil.avatar,
        }}
        style={{ height: 60, width: 60, marginTop: -60, alignSelf: "center" }}
      />

      <Grid style={styles.myMiddle}>
        <Text style={{ color: greyFont, paddingTop: 15 }}>{"Names"}</Text>

        <Text style={styles.myBlack}>
          {userData !== "EMPTY" ? userData.username : "NOT log in"}
        </Text>

        <Text style={{ color: greyFont, paddingTop: 30 }}>{"About"}</Text>

        <Text style={styles.myBlack}>
          {userProfil.bio !== "" ? userProfil.bio : "Empty bio :("}
        </Text>

        <Text style={{ color: greyFont, paddingTop: 30 }}>{"Joined"}</Text>

        <Text style={styles.myBlack}>
          {userProfil !== "EMPTY"
            ? new Date(userProfil.created * 1000).toDateString()
            : "NOT log in"}
        </Text>

        <Text style={{ color: greyFont, paddingTop: 30 }}>
          {"Internet Points"}
        </Text>

        <Text style={styles.myBlack}>
          {userProfil !== "EMPTY" ? userProfil.reputation : "NOT log in"}
        </Text>

        <Text style={{ color: greyFont, paddingTop: 30 }}>{"Notoriety"}</Text>

        <Text style={styles.myBlack}>
          {userProfil !== "EMPTY" ? userProfil.reputation_name : "NOT log in"}
        </Text>
      </Grid>
      <Button
        color="rgb(27,183,110)"
        title="Disconnect"
        onPress={() => eraseUserData().then(disconnect())}
      ></Button>
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
});
