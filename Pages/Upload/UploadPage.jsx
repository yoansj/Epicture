import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Container, Input, CheckBox, Header, Button, Icon } from "native-base";

import { getUserData } from "../Authentification/AuthPage";
import { imgurImageUpload } from "../../imgur";

export default function UploadPage() {

  // Defines the step of the upload
  // - uploadType : The user can either upload an album or an image
  // - mediaType :
  const [step, setStep] = useState("uploadType");


  // Can be an image or a video
  // When the user picks a media
  // toPublish[0] is the uri of the media and toPublish[1] is the type of the media (video or image)
  const [toPublish, setToPublish] = useState(null);
  // Know if user gave permission
  const [permission, setPermission] = useState(false);

  // Title of the post
  const [title, setTitle] = useState("Man google");
  // Description of the post
  const [description, setDescription] = useState("Tu ouvres ton navigateur et tu vas sur google mec");

  function uploadImage() {
    getUserData().then(value => {
      imgurImageUpload(value.acess_token, toPublish[2], toPublish[1], null, title, description, null).then(
        value => {console.log("Upload over !")}
      )
    })
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') setPermission(false);
        else setPermission(true);
      }
    })();
  }, [])

  async function pickImage() {
    if (permission === false) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') return;
      else setPermission(true);
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    })
    if (!result.cancelled) setToPublish([result.uri, result.type, result.base64]);
  }

  return (
    <Container style={styles.myBlack}>
      <Header rounded androidStatusBarColor='black' style={{backgroundColor: 'black'}}>
        <Text style={{marginTop: 17, color: 'rgb(27,183,110)', fontSize: 20}}>Upload</Text>
      </Header>
      {step === "uploadType" ?
        <Container style={styles.myBlack}>
          <Button transparent bordered>
            <Icon name="albums" style={{fontSize: 40}} />
          </Button>
        </Container>
      : []}
    </Container>
  )

  return (
    <Container style={styles.myBlack}>
      <Header rounded androidStatusBarColor='black' style={{backgroundColor: 'black'}}>
        <Text style={{marginTop: 17, color: 'rgb(27,183,110)', fontSize: 20}}>Upload</Text>
      </Header>
      <Button title="Select Image" onPress={() => pickImage()}/>
      {toPublish !== null && toPublish[1] === 'video' ?
        <Video style={{ width: 355, height: 280 }} source={{uri: (toPublish !== null ? toPublish[0] : null)}} rate={1.0} volume={0.0} isLooping shouldPlay style={{ width: 355, height: 280 }} resizeMode="cover" />
        :
        <Image source={{ uri: (toPublish !== null ? toPublish[0] : null)}} style={{ height: 200, width: null}} />
      }
      <Input style={{borderColor: 'green', borderWidth: 2, height: 50, flex: 0, color: 'white'}} placeholder="Title of your post" value={title} onChangeText={(text) => setTitle(text)} />
      <Input multiline style={{borderColor: 'green', borderWidth: 2, height: 90, flex: 0, color: 'white'}} placeholder="Description" value={description} onChangeText={(text) => setDescription(text)} />
      <Button title="Upload now" onPress={() => uploadImage()}/>
    </Container>
  );
}

const styles = StyleSheet.create({
  myTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor: "#566573",
    width: "100%",
    height: "45%",
  },
  scrolLeft: {
    textAlign: "center",
    height: 20,
    width: 175,
  },
  myPickerGreen:{
    color: 'rgb(27,183,110)',
    width: undefined
  },
  myGreen:{
    backgroundColor: 'rgb(27,183,110)'
  },
  myBlack: {
    backgroundColor: 'rgb(18,18,18)',
    color: 'rgb(27,183,110)'
  },
  myBar: {
    marginLeft: 80,
    marginTop: 60,
    width: 200,
    height: 40,
    borderColor: "black",
    backgroundColor: "#808B96",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderWidth: 1,
    alignSelf: "center",
  }
});