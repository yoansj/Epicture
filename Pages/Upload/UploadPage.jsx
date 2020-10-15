import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Container, Input, Spinner, Content, CheckBox, Header, Button, Icon, Toast } from "native-base";
import { Col, Row, Grid } from 'react-native-easy-grid';

import { getUserData } from "../Authentification/AuthPage";
import { imgurAlbumCreate, imgurImageUpload } from "../../imgur";

export default function UploadPage() {

  // Defines the step of the upload
  // - 1 : first
  // - 2 : create or add
  // - 3 : createImages or addImages
  // - 4 : createPublish or publish
  const [step, setStep] = useState("first");

  // Album name and description
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");

  // Media that will be published (array of objects)
  const [media, setMedia] = useState(null);

  // Link modal
  const [linkModal, setLinkModal] = useState(false);
  // Link image
  const [link, setLink] = useState("");

  // Files modal
  const [filesModal, setFilesModal] = useState(false);
  // Chosen file when user hits "Add from file button"
  const [file, setFile] = useState(null);

  // New media description
  const [mediaDesc, setMediaDesc] = useState("");

  // Know if app has files permission
  const [permission, setPermission] = useState(false);

  // Creating step
  const [creatingStep, setCreatingStep] = useState("album");

  // New album hash
  const [albumHash, setAlbumHash] = useState("");

  // Publishing media
  const [mediaIndex, setMediaIndex] = useState(0);

  // Publishing errors
  const [mediaErrors, setMediaErrors] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') setPermission(false);
        else setPermission(true);
      }
    })();
  }, [])

  function addMedia(type, newMedia, desc, base64) {
    let tmp = media;
    if (media === null) tmp = [];

    if (type === "video" || type === "image" ) {
      tmp.push({type, newMedia, desc, base64});
      setMedia(tmp);
      setFilesModal(false);
      setMediaDesc("");
      setFile(null);
      return;
    }

    if (newMedia !== "" && type === "link") {
      tmp.unshift({type, newMedia, desc});
      setMedia(tmp);
      closeLinkModal();
    } else {
      closeLinkModal();
      Toast.show({
        text: "Can't add an image with no link",
        buttonText: "Okay",
        type: 'danger',
        duration: 5000,
      })
    }
  }

  function openLinkModal() {
    setLink("");
    setMediaDesc("");
    setFile(null);
    setLinkModal(true);
  }

  function closeLinkModal() {
    setLink("");
    setMediaDesc("");
    setFile(null);
    setLinkModal(false);
  }

  async function createAlbum() {
    setStep("createPublish")
    getUserData().then(userdata => {
      imgurAlbumCreate(userdata.acess_token, null, null, albumName, albumDescription, "public", null).then(
        albumCreate => (async () => {
          if (albumCreate.rep.success === false) {
            setStep("createImages");
            Toast.show({
              text: "An issue was encountered while creating the album",
              buttonText: "Okay",
              type: 'danger',
              duration: 5000,
            })
            console.log("Album non créé !");
          } else {
            console.log("-----ALBUM CREATE----");
            setCreatingStep("images");
            await media.forEach((element) => (async () => {
              if (element.type === "link") {
                await imgurImageUpload(userdata.acess_token, element.newMedia, "url", albumCreate.data.data.id, element.desc, element.desc, null).then(
                  call => {
                    if (call.data.success === true) {
                      console.log("Link upload worked !");
                      setMediaIndex(mediaIndex + 1);
                      Toast.show({text: "Uploaded 1 image (link)", buttonText: "Cool", type: 'success', duration: 1000});
                    } else {
                      setMediaErrors(mediaErrors + 1);
                      Toast.show({text: "Upload failed for image (link)", buttonText: "Crap !", type: 'danger', duration: 1000});
                    }
                  }
                )
              }
              if (element.type === "image") {
                await imgurImageUpload(userdata.acess_token, element.base64, "image", albumCreate.data.data.id, element.desc, element.desc, null).then(
                  call => {
                    if (call.data.success === true) {
                      console.log("Image upload worked !");
                      setMediaIndex(mediaIndex + 1);
                      Toast.show({text: "Uploaded 1 image", buttonText: "Cool", type: 'success', duration: 1000});
                    } else {
                      setMediaErrors(mediaErrors + 1);
                      Toast.show({text: "Upload failed for image", buttonText: "Crap !", type: 'danger', duration: 1000});
                    }
                  }
                )
              }
              if (element.type === "video") {
                console.log(element);
                await imgurImageUpload(userdata.acess_token, element.newMedia, "video", albumCreate.data.data.id, element.desc, element.desc, null).then(
                  call => {
                    if (call.data.success === true) {
                      console.log("Video upload worked !");
                      setMediaIndex(mediaIndex + 1);
                      Toast.show({text: "Uploaded 1 video", buttonText: "Cool", type: 'success', duration: 1000});
                    } else {
                      setMediaErrors(mediaErrors + 1);
                      Toast.show({text: "Upload failed for video", buttonText: "Crap !", type: 'danger', duration: 1000});
                    }
                  }
                )
              }
            })().then(
              () => {
                console.log("Fin de création ! index:", mediaIndex);
              }
            ))
          }
        })()
      )
    })
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
      quality: 1,
      base64: true,
    })
    if (!result.cancelled) setFile({uri: result.uri, type: result.type, base64: result.base64});
  }

  function mediaPreview() {
    if (media === null)
      return (
        <Text style={{color: 'rgb(27,183,110)', fontSize: 20, alignSelf: 'center'}}>Nothing to see here sadly :(</Text>
      )
    return (
      media.map((element, index) => {
        return (
          <View key={index}>
            {element.type === "link" || element.type === "image" ? (
              <Image
                source={{
                  uri: element.type === "link" || element.type === "image" ? element.newMedia : "",
                }}
                style={{ height: 300, width: null, flex: 0 }}
              />
            ) : (
              <Video
                style={{ width: 355, height: 280 }}
                source={{uri: element.newMedia}}
                rate={1.0}
                volume={0.0}
                isLooping
                shouldPlay
                style={{ width: 355, height: 280 }}
                resizeMode="cover"
              />
            )}
            <Text
              style={{backgroundColor: 'white', color: 'black', textAlign: 'center'}}
            >{element.type === "image" || element.type === "url" ? "Image " : "Video "}{index + 1} : {element.desc === "" ? "(Empty description)" : element.desc}</Text>
          </View>
        );
      }
      )
    )
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
              source={{ uri: (link === "" ? "https://media1.tenor.com/images/817c85b86e9860dbd6d947d69ea2fee7/tenor.gif?itemid=14165517" : link),}}
              style={{ height: 300, width: null, flex: 0 }}
            />
            <Text style={{fontSize: 20, color: "rgb(33,228,255)", alignSelf: 'center'}}>- Preview of your image -</Text>
            <Text style={{paddingTop: 30, color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>Enter a link for your image</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} value={link} onChangeText={(text) => setLink(text)} multiline placeholder="Any valid link" />
            <Text style={{paddingTop: 30, color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>Enter a description for your image</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} value={mediaDesc} onChangeText={(text) => setMediaDesc(text)} multiline placeholder="You can also leave this empty" />
            <View style={{paddingTop: 60, display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
              <Button transparent onPress={() => closeLinkModal()}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-arrow-dropleft-circle" style={{fontSize: 50, color: "rgb(246, 43, 33)"}} />
                  <Text style={{color: "rgb(246, 43, 33)", fontSize: 30, textAlign: 'center'}}>Cancel</Text>
                </View>
              </Button>
              <Button transparent onPress={() => addMedia("link", link, mediaDesc)}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-add-circle-outline" style={{fontSize: 50, color: "rgb(33,228,255)"}} />
                  <Text style={{color: "rgb(33,228,255)", fontSize: 30, textAlign: 'center'}}>Add</Text>
                </View>
              </Button>
            </View>
          </Container>
        </Modal>
        <Modal
        animationType="slide"
        visible={filesModal}
        onRequestClose={() => setFilesModal(false)}>
          <Container style={{backgroundColor: 'rgb(30, 30, 30)'}}>
            <View style={{paddingTop: 20}} />
            {file === null ?
              <Image
                source={{ uri: (link === "" ? "https://media1.tenor.com/images/817c85b86e9860dbd6d947d69ea2fee7/tenor.gif?itemid=14165517" : link),}}
                style={{ height: 300, width: null, flex: 0 }}
              />
            : []}
            {file !== null && file.type === "video" ?
              <Video
                style={{ width: 355, height: 300 }}
                source={{uri: file.uri}}
                rate={1.0}
                volume={0.5}
                isLooping
                shouldPlay
                resizeMode="cover"
              />
              : file !== null ?
              <Image
                source={{ uri: file.uri}}
                style={{ height: 300, width: null, flex: 0 }}
              />
            : []}
            <Text style={{fontSize: 20, color: "rgb(33,228,255)", alignSelf: 'center'}}>- Preview of your media -</Text>
            <Button success style={{alignSelf: 'center'}} onPress={() => {pickImage()}}>
              <Text style={{color: "white", fontSize: 20, alignSelf: 'center', fontWeight: "bold"}}>Pick new media</Text>
            </Button>
            <Text style={{paddingTop: 30, color: "rgb(33,228,255)", fontSize: 20, alignSelf: 'center'}}>Enter a description for your image</Text>
            <Input style={{color: "white", flex: 0, alignSelf: 'center'}} value={mediaDesc} onChangeText={(text) => setMediaDesc(text)} multiline placeholder="You can also leave this empty" />
            <View style={{paddingTop: 60, display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
              <Button transparent onPress={() => {setFilesModal(false); setFile(null); setMediaDesc("");}}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-arrow-dropleft-circle" style={{fontSize: 50, color: "rgb(246, 43, 33)"}} />
                  <Text style={{color: "rgb(246, 43, 33)", fontSize: 30, textAlign: 'center'}}>Cancel</Text>
                </View>
              </Button>
              <Button transparent onPress={() => addMedia(file.type, file.uri, mediaDesc, file.base64)}>
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
            <Button transparent onPress={() => setStep("create")}>
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
              <Icon name="ios-arrow-dropleft-circle" style={{fontSize: 80, color: "rgb(221,220,220)"}} />
            </Button>
            <Button transparent onPress={() => {setStep("createImages")}}>
              <Icon name="ios-arrow-dropright-circle" style={{fontSize: 80, color: "rgb(33,228,255)"}} />
            </Button>
          </View>
        </View>
      : []}
      {step === "createImages" ?
        <View>
          <Text style={{color: "rgb(27,183,110)", fontSize: 25, alignSelf: 'center', paddingVertical: 20}}>Album preview</Text>
          <ScrollView style={{height: 300}}>
            {mediaPreview(media)}
          </ScrollView>
          <Text style={{color: "rgb(27,183,110)", fontSize: 15, alignSelf: 'center', paddingVertical: 20}}>- {media === null ? '0' : media.length} media to publish -</Text>
          <View style={{paddingVertical: 40, display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
            <View style={{marginRight: 15}}>
              <Button transparent onPress={() => openLinkModal()}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-link" style={{fontSize: 40, color: "rgb(27,183,110)"}} />
                  <Text style={{color: "rgb(27,183,110)", fontSize: 20, textAlign: 'center'}}>Add with link</Text>
                </View>
              </Button>
            </View>
            <View style={{marginLeft: 15}}>
              <Button transparent onPress={() => setFilesModal(true)}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-folder" style={{fontSize: 40, color: "rgb(27,183,110)"}} />
                  <Text style={{color: "rgb(27,183,110)", fontSize: 20, textAlign: 'center'}}>Add from files</Text>
                </View>
              </Button>
            </View>
          </View>
          <View style={{paddingVertical: 10, display: 'flex', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
            <View style={{marginRight: 15}}>
              <Button transparent onPress={() => {setStep("create")}}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-return-left" style={{fontSize: 35, color: "rgb(221,220,220)"}} />
                  <Text style={{color: "rgb(221,220,220)", fontSize: 15, textAlign: 'center'}}>Cancel</Text>
                </View>
              </Button>
            </View>
            <View style={{marginLeft: 15, marginRight: 15}}>
              <Button transparent onPress={() => setMedia(null)}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-trash" style={{fontSize: 35, color: "rgb(236,38,19)"}} />
                  <Text style={{color: "rgb(236,38,19)", fontSize: 15, textAlign: 'center'}}>Erase medias</Text>
                </View>
              </Button>
            </View>
            <View style={{marginLeft: 15}}>
              <Button transparent onPress={() => createAlbum()}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="ios-add-circle" style={{fontSize: 35, color: 'rgb(27,183,110)'}} />
                  <Text style={{color: 'rgb(27,183,110)', fontSize: 15, textAlign: 'center'}}>Publish</Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      : []}
      {step === "createPublish" ?
        <View style={{alignItems: 'center'}}>
          {creatingStep === "album" ?
            <View style={{alignItems: "center", paddingVertical: 180}}>
              <Text style={{color: "rgb(27,183,110)", fontSize: 25, alignSelf: 'center', paddingVertical: 20}}>Creating your album</Text>
              <Text style={{color: "rgb(27,183,110)", fontSize: 25, alignSelf: 'center', paddingVertical: 20}}>This might take some time</Text>
              <Spinner color="green" style={{paddingVertical: 20}} />
              <View style={{alignSelf: 'center', paddingVertical: 50}}>
                <Button transparent onPress={() => {setStep("createImages")}}>
                  <View style={{alignItems: 'center'}}>
                    <Icon name="ios-return-left" style={{fontSize: 35, color: "rgb(221,220,220)"}} />
                    <Text style={{color: "rgb(221,220,220)", fontSize: 15, textAlign: 'center'}}>Cancel</Text>
                  </View>
                </Button>
              </View>
            </View>
          : []}
          {creatingStep === "images" ?
            <View style={{alignItems: "center", paddingVertical: 180}}>
              <Text style={{color: "rgb(27,183,110)", fontSize: 25, alignSelf: 'center', paddingVertical: 20}}>Adding medias to album</Text>
              <Text style={{color: "rgb(27,183,110)", fontSize: 25, alignSelf: 'center', paddingVertical: 20}}>Media published {mediaIndex + " / " + media.length}</Text>
              <Text style={{color: "rgb(27,183,110)", fontSize: 25, alignSelf: 'center', paddingVertical: 20}}>Medias not published : {mediaErrors}</Text>
              <Spinner color="green" style={{paddingVertical: 20}} />
              <Button transparent onPress={() => {setStep("first"); setMediaIndex(0); setMediaErrors(0)}}>
                  <View style={{alignItems: 'center'}}>
                    <Icon name="ios-return-left" style={{fontSize: 35, color: "rgb(221,220,220)"}} />
                    <Text style={{color: "rgb(221,220,220)", fontSize: 15, textAlign: 'center'}}>Cancel</Text>
                  </View>
                </Button>
            </View>
          : []}
        </View>
      : []}
    </Container>
  )
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