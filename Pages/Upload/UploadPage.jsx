import React, { useState, useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

import { getUserData } from "../Authentification/AuthPage";
import { imgurGallery } from "../../imgur";
import { Container } from "native-base";

export default function UploadPage() {

  //Can be an image or a video
  const [toPublish, setToPublish] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, [])

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })
    if (!result.cancelled) setToPublish([result.uri, result.type]);
  }

  return (
    <Container>
      <Text style={{color: 'blue'}}>Upload image</Text>
      <Button title="Select Image" onPress={() => pickImage()}/>
      {toPublish !== null && toPublish[1] === 'video' ?
        <Video style={{ width: 355, height: 280 }} source={{uri: (toPublish !== null ? toPublish[0] : null)}} rate={1.0} volume={0.0} isLooping shouldPlay style={{ width: 355, height: 280 }} resizeMode="cover" />
        :
        <Image source={{ uri: (toPublish !== null ? toPublish[0] : null)}} style={{ height: 200, width: null}} />
      }
    </Container>
  );
}
