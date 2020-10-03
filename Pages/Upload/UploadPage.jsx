import React from "react";
import { View, Text, Button } from "react-native";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
import { getUserData } from "../Authentification/AuthPage";
import { imgurGallery } from "../../imgur";

export default function UploadPage() {
  return (
    <View>
      <Text>Card displayer</Text>
      <Button title="GALLERY" onPress={() => {
        getUserData().then(value => imgurGallery(value.acess_token, "user", "viral", 1, "year", "true", "true"));
        }} />
    </View>
  );
}
