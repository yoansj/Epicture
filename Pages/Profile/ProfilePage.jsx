import React , {useState, useEffect} from "react";
import { View, Text, Button } from "react-native";
import { eraseUserData, getUserData } from "../Authentification/AuthPage";
import { imgurProfileBase } from "../../imgur";

export default function ProfilePage({route}) {

  const { disconnect } = route.params;
  // the user data
  const [userData, setUserData] = useState("EMPTY");
  const [userProfil, setProfile] = useState("EMPTY");


  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurProfileBase(value.acess_token, "Mamouki").then((value) =>
        setProfile(value)
      );
    });
  });

  return (
    <View>
      <Text style={{color: 'red'}}>{userData !== "EMPTY" ? userData.username : "NOT log in"}</Text>
      <Button title="Disconnect" onPress={() => eraseUserData().then(disconnect())}></Button>
    </View>
  );
}
