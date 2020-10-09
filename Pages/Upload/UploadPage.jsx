import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Container, Input, Content, CheckBox, Header, Button, Icon } from "native-base";
import { Col, Row, Grid } from 'react-native-easy-grid';

import { getUserData } from "../Authentification/AuthPage";
import { imgurImageUpload } from "../../imgur";

export default function UploadPage() {

  // Defines the step of the upload
  // - 1 : first
  // - 2 : create or add
  // - 3 : createImages or addImages
  const [step, setStep] = useState("first");

  // Album name and description
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");

  // Media that will be published (array)
  const [media, setMedia] = useState(null);

  // Link modal
  const [linkModal, setLinkModal] = useState(false);
  // Link image
  const [link, setLink] = useState("");

  // New media description
  const [mediaDesc, setMediaDesc] = useState("");


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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') setPermission(false);
        else setPermission(true);
      }
    })();
  }, [])

  function uploadImage() {
    getUserData().then(value => {
      imgurImageUpload(value.acess_token, toPublish[2], toPublish[1], null, title, description, null).then(
        value => {console.log("Upload over !")}
      )
    })
  }

  function addMedia(type, newMedia, description) {
    let tmp = media;

    if (media === null) tmp = [];
    if (newMedia !== "" && type === "link") {
      tmp.push([type, newMedia, description]);
      setMedia(tmp);
      setLinkModal(false);
      setLink("");
      console.log("Link added :)");
      console.log(tmp);
    } else {
      setLink("What are you trying to do exactly ?");
    }
  }

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
      <Modal
        animationType="slide"
        visible={linkModal}
        onRequestClose={() => setLinkModal(false)}>
          <Container style={{backgroundColor: 'rgb(30, 30, 30)'}}>
            <View style={{paddingTop: 20}} />
            <Image
              source={{ uri: (link === "" ? "https://media1.tenor.com/images/06c57d9a1182c3e33093e39bafe4767b/tenor.gif?itemid=18534341" : link),}}
              style={{ height: 300, width: null, flex: 0 }}
            />
            <Text style={{fontSize: 20, color: "rgb(33,228,255)", alignSelf: 'center'}}>- Preview of your image -</Text>
            <Text style={{paddingTop: 30, color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>Enter a link for your image</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} value={link} onChangeText={(text) => setLink(text)} multiline placeholder="Any valid link" />
            <Text style={{paddingTop: 30, color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>Enter a description for your image</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} value={mediaDesc} onChangeText={(text) => setMediaDesc(text)} multiline placeholder="You can also leave this empty" />
            <View style={{paddingTop: 60, display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
              <Button transparent onPress={() => setLinkModal(false)}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-arrow-dropleft-circle" style={{fontSize: 50, color: "rgb(246, 43, 33)"}} />
                  <Text style={{color: "rgb(246, 43, 33)", fontSize: 30, textAlign: 'center'}}>Cancel</Text>
                </View>
              </Button>
              <Button transparent onPress={() => addMedia("link", link, description)}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-add-circle-outline" style={{fontSize: 50, color: "rgb(33,228,255)"}} />
                  <Text style={{color: "rgb(33,228,255)", fontSize: 30, textAlign: 'center'}}>Add</Text>
                </View>
              </Button>
            </View>
          </Container>
        </Modal>
      <Header rounded androidStatusBarColor='black' style={{backgroundColor: 'black'}}>
        <Text style={{marginTop: 17, color: 'rgb(27,183,110)', fontSize: 20}}>Upload</Text>
      </Header>
      {step === "first" ?
        <Container style={styles.myBlack}>
          <Container style={styles.myBlackPadding}>
            <Button transparent onPress={() => {setStep("create"); console.log(step);}}>
              <Grid>
                <Col style={{alignItems: 'center'}}>
                  <Icon name="albums" style={{fontSize: 50, color: "rgb(33,228,255)"}} />
                  <Text style={{color: "rgb(33,228,255)", fontSize: 30}}>Create an album</Text>
                </Col>
              </Grid>
            </Button>
          </Container>
          <Container style={styles.myBlackPadding}>
            <Button transparent onPress={() => setStep("upload")}>
              <Grid>
                <Col style={{alignItems: 'center'}}>
                  <Icon name="ios-add-circle-outline" style={{fontSize: 50, color: "rgb(255,33,167)"}} />
                  <Text style={{color: "rgb(255,33,167)", fontSize: 30, textAlign: 'center'}}>Upload to an existing album</Text>
                </Col>
              </Grid>
            </Button>
          </Container>
        </Container>
      : []}
      {step === "create" ?
        <View style={styles.myBlack}>
          <Text style={{color: "rgb(33,228,255)", fontSize: 30, alignSelf: 'center', paddingVertical: 50}}>Create an album</Text>
          <View>
            <Text style={{color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>First of all a name</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} onChangeText={(text) => setAlbumName(text)} placeholder="Name of your album" />
          </View>
          <View style={{paddingVertical: 70}}>
            <Text style={{color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>Then a description</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} onChangeText={(text) => setAlbumDescription(text)} multiline placeholder="Description of your album" />
          </View>
          <View style={{paddingVertical: 80, display: 'flex', flexDirection: 'row', alignSelf: 'center'}}>
            <Button transparent onPress={() => {setStep("first")}}>
              <Icon name="ios-arrow-dropleft-circle" style={{fontSize: 80, color: "grey"}} />
            </Button>
            <Button transparent onPress={() => {setStep("createImages")}}>
              <Icon name="ios-arrow-dropright-circle" style={{fontSize: 80, color: "rgb(33,228,255)"}} />
            </Button>
          </View>
        </View>
      : []}
      {step === "createImages" ?
        <View>
          <Text style={{color: "rgb(33,228,255)", fontSize: 30, alignSelf: 'center', paddingVertical: 20}}>Album preview</Text>
          <ScrollView>
          </ScrollView>
          <Text style={{color: "rgb(33,228,255)", fontSize: 15, alignSelf: 'center', paddingVertical: 20}}>- {media === null ? '0' : media.length} media to publish -</Text>
          <View style={{paddingVertical: 80, display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
            <Button transparent onPress={() => {setLinkModal(true); console.log("touuuchhh")}}>
              <View style={{alignItems: 'center'}}>
                <Icon name="ios-link" style={{fontSize: 40, color: "rgb(97,33,255)"}} />
                <Text style={{color: "rgb(97,33,255)", fontSize: 20, textAlign: 'center'}}>Add with link</Text>
              </View>
            </Button>
            <Button transparent onPress={() => setStep("first")}>
              <View style={{alignItems: 'center'}}>
                <Icon name="ios-folder" style={{fontSize: 40, color: "rgb(255,164,4)"}} />
                <Text style={{color: "rgb(255,164,4)", fontSize: 20, textAlign: 'center'}}>Add from device</Text>
              </View>
            </Button>
          </View>
        </View>
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
  myBlackPadding: {
    backgroundColor: 'rgb(18,18,18)',
    color: 'rgb(27,183,110)',
    paddingVertical: 150,
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