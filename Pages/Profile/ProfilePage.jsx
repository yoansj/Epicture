import React from "react";
import { View, Text, Button } from "react-native";
import { eraseUserData } from "../Authentification/AuthPage";

export default function ProfilePage({route}) {

  const { disconnect } = route.params;

  return (
    <View>
      <Text>Yoooo</Text>
      <Button title="Disconnect" onPress={() => eraseUserData().then(disconnect())}></Button>
    </View>
  );
}
