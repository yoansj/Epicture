import React , {useState, useEffect} from "react";
import { View, Text, Button , Image, StyleSheet} from "react-native";
import { eraseUserData, getUserData } from "../Authentification/AuthPage";
import { imgurProfileBase } from "../../imgur";
import { color } from "react-native-reanimated";
import { Container } from "native-base";

export default function ProfilePage({route}) {

  const greyFont = "#a7a7a7";
  const { disconnect } = route.params;
  // the user data
  const [userData, setUserData] = useState("EMPTY");
  const [userProfil, setProfile] = useState("EMPTY");


  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurProfileBase(value.acess_token, "Mamouki").then((value) =>
        setProfile(value.data)
      );
    });
  }, []);

  return (
    <Container style={styles.myBlack}>

      <Image
        source={{
          uri: userProfil.cover
        }}
          style={{ height: 160, width: null}}
      />

      <Image
        source={{
          uri: userProfil.avatar
        }}
          style={{ height: 60, width: 60, marginTop: -60}}
      />

      <Text style={{color: greyFont}}>{"Names"}</Text>
      <Text style={styles.myBlack}>{userData !== "EMPTY" ? userData.username : "NOT log in"}</Text>

      <Text style={{color: greyFont}}>{"About"}</Text>
      <Text style={styles.myBlack}>{userProfil.bio !== "" ? userProfil.bio : "Empty bio :("}</Text>

      <Text style={{color: greyFont}}>{"Joined"}</Text>
      <Text style={styles.myBlack}>{userProfil !== "EMPTY" ? new Date(userProfil.created * 1000).toDateString() : "NOT log in"}</Text>

      <Text style={{color: greyFont}}>{"Internet Points"}</Text>
      <Text style={styles.myBlack}>{userProfil !== "EMPTY" ? userProfil.reputation : "NOT log in"}</Text>

      <Text style={{color: greyFont}}>{"Notoriety"}</Text>
      <Text style={styles.myBlack}>{userProfil !== "EMPTY" ? userProfil.reputation_name : "NOT log in"}</Text>

      <Button color="rgb(27,183,110)" title="Disconnect" onPress={() => eraseUserData().then(disconnect())}></Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  myMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(18,18,18)",
  },
  myGreen:{
    backgroundColor: 'rgb(27,183,110)'
  },
  myBlack: {
    backgroundColor: 'rgb(18,18,18)',
    color: 'rgb(27,183,110)'
  }
});
