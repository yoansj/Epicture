import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import {
  Container,
  Input,
  Spinner,
  Header,
  Button,
  Icon,
  Toast,
} from "native-base";
import { Col, Grid } from "react-native-easy-grid";

import { getUserData } from "../Authentification/AuthPage";
import {
  imgurAlbumCreate,
  imgurAlbumShare,
  imgurImageUpload,
} from "../../imgur";
import {
  BACKGROUND_LIGHT,
  generalStyle,
  GENERAL_COLOR,
  TEXT_COLOR,
} from "../../Colors";

/**
 * The Upload Page lets the user uploads albums to imgur
 * The page was coded with a step by step system
 * The user first enters the infos about his posts and then adds medias to the album
 */
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
  // Camera modal
  const [cameraModal, setCameraModal] = useState(false);
  // Camera opened in modal
  const [camera, setCamera] = useState(false);
  // Camera type (front back)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  // Camera flash
  const [flash, setFlash] = useState(false);
  // Camera ref used to take pictures
  const [cameraRef, setCameraRef] = useState(null);
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
  // Title of the post
  const [postName, setPostName] = useState("");
  // Topic of the post
  const [topic, setTopic] = useState("");
  // Is the post mature
  const [mature, setMature] = useState(false);
  // Publishing media
  const [mediaIndex, setMediaIndex] = useState(0);
  // Publishing errors
  const [mediaErrors, setMediaErrors] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") setPermission(false);
        else setPermission(true);
      }
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  function addMedia(type, newMedia, desc, base64) {
    let tmp = media;
    if (media === null) tmp = [];

    if (type === "video" || type === "image") {
      tmp.unshift({ type, newMedia, desc, base64 });
      setMedia(tmp);
      setFilesModal(false);
      setCameraModal(false);
      setMediaDesc("");
      setFile(null);
      setLink("");
      return;
    }

    if (newMedia !== "" && type === "link") {
      tmp.unshift({ type, newMedia, desc });
      setMedia(tmp);
      closeLinkModal();
    } else {
      closeLinkModal();
      Toast.show({
        text: "Can't add an image with no link",
        buttonText: "Okay",
        type: "danger",
        duration: 5000,
      });
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
    setAlbumDescription("");
    setAlbumName("");
  }

  function checkPost() {
    if (postName !== "") {
      setStep("createImages");
    } else {
      Toast.show({
        text: "The title of your post can't be empty",
        buttonText: "Okay",
        type: "danger",
        duration: 5000,
      });
    }
  }

  function checkMedia() {
    if (media !== null && media.length !== 0) {
      createAlbum();
    } else {
      Toast.show({
        text: "You need to add at list one media",
        buttonText: "Okay",
        type: "danger",
        duration: 5000,
      });
    }
  }

  function resetVariables() {
    setStep("first");
    setMediaIndex(0);
    setMediaErrors(0);
    setMedia(null);
    setPostName("");
    setTopic("");
  }

  function takePicture() {
    if (cameraRef) {
      cameraRef
        .takePictureAsync({
          quality: 0.5,
          base64: true,
        })
        .then((value) => {
          setFile({ type: "image", uri: value.uri, base64: value.base64 });
          setLink(value.uri);
          setCamera(false);
        });
    }
  }

  async function createAlbum() {
    setStep("createPublish");
    getUserData().then((userdata) => {
      imgurAlbumCreate(
        userdata.acess_token,
        null,
        null,
        albumName,
        albumDescription,
        "public",
        null
      ).then((albumCreate) =>
        (async () => {
          if (albumCreate.rep.success === false) {
            setStep("createImages");
            Toast.show({
              text: "An issue was encountered while creating the album",
              buttonText: "Okay",
              type: "danger",
              duration: 5000,
            });
          } else {
            setCreatingStep("images");
            await media.forEach((element) =>
              (async () => {
                if (element.type === "link") {
                  await imgurImageUpload(
                    userdata.acess_token,
                    element.newMedia,
                    "url",
                    albumCreate.data.data.id,
                    element.desc,
                    element.desc,
                    null
                  ).then((call) => {
                    if (call.data.success === true) {
                      setMediaIndex(mediaIndex + 1);
                      Toast.show({
                        text: "Uploaded 1 image (link)",
                        buttonText: "Cool",
                        type: "success",
                        duration: 1000,
                      });
                    } else {
                      setMediaErrors(mediaErrors + 1);
                      Toast.show({
                        text: "Upload failed for image (link)",
                        buttonText: "Crap !",
                        type: "danger",
                        duration: 1000,
                      });
                    }
                  });
                }
                if (element.type === "image") {
                  await imgurImageUpload(
                    userdata.acess_token,
                    element.base64,
                    "image",
                    albumCreate.data.data.id,
                    element.desc,
                    element.desc,
                    null
                  ).then((call) => {
                    if (call.data.success === true) {
                      setMediaIndex(mediaIndex + 1);
                      Toast.show({
                        text: "Uploaded 1 image",
                        buttonText: "Cool",
                        type: "success",
                        duration: 1000,
                      });
                    } else {
                      setMediaErrors(mediaErrors + 1);
                      Toast.show({
                        text: "Upload failed for image",
                        buttonText: "Crap !",
                        type: "danger",
                        duration: 1000,
                      });
                    }
                  });
                }
                if (element.type === "video") {
                  await imgurImageUpload(
                    userdata.acess_token,
                    element.newMedia,
                    "video",
                    albumCreate.data.data.id,
                    element.desc,
                    element.desc,
                    null
                  ).then((call) => {
                    if (call.data.success === true) {
                      setMediaIndex(mediaIndex + 1);
                      Toast.show({
                        text: "Uploaded 1 video",
                        buttonText: "Cool",
                        type: "success",
                        duration: 1000,
                      });
                    } else {
                      setMediaErrors(mediaErrors + 1);
                      Toast.show({
                        text: "Upload failed for video",
                        buttonText: "Crap !",
                        type: "danger",
                        duration: 1000,
                      });
                    }
                  });
                }
              })().then(() => {
                imgurAlbumShare(
                  userdata.acess_token,
                  albumCreate.data.data.id,
                  postName,
                  topic,
                  mature,
                  null
                ).then((call) => {
                  if (call.data) {
                    Toast.show({
                      text: "Album posted succesfully",
                      buttonText: "Cool",
                      type: "success",
                      duration: 5000,
                    });
                  } else {
                    Toast.show({
                      text: "Failed to post album",
                      buttonText: "Crap !",
                      type: "danger",
                      duration: 5000,
                    });
                  }
                });
              })
            );
          }
        })()
      );
    });
  }

  async function pickImage() {
    if (permission === false) {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== "granted") return;
      else setPermission(true);
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.cancelled)
      setFile({ uri: result.uri, type: result.type, base64: result.base64 });
  }

  function mediaPreview() {
    if (media === null)
      return (
        <Text
          style={{
            ...styles.purpleText,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          Add medias to see the media preview here
        </Text>
      );
    return media.map((element, index) => {
      return (
        <View key={index}>
          {element.type === "link" || element.type === "image" ? (
            <Image
              source={{
                uri:
                  element.type === "link" || element.type === "image"
                    ? element.newMedia
                    : "",
              }}
              style={{ height: 300, width: null, flex: 1 }}
              resizeMode="contain"
            />
          ) : (
            <Video
              style={{ width: 355, height: 280 }}
              source={{ uri: element.newMedia }}
              rate={1.0}
              volume={0.0}
              isLooping
              shouldPlay
              style={{ width: 355, height: 280 }}
              resizeMode="contain"
            />
          )}
          <Text
            style={{
              backgroundColor: GENERAL_COLOR,
              color: BACKGROUND_LIGHT,
              textAlign: "center",
            }}
          >
            {element.type === "image" || element.type === "url"
              ? "Image "
              : "Video "}
            {index + 1} :{" "}
            {element.desc === "" ? "(Empty description)" : element.desc}
          </Text>
        </View>
      );
    });
  }

  return (
    <Container style={generalStyle.primaryColor}>
      <Modal
        animationType="slide"
        visible={linkModal}
        onRequestClose={() => setLinkModal(false)}
      >
        <Container style={generalStyle.primaryColor}>
          <View style={{ paddingTop: 20 }} />
          <Image
            source={{
              uri:
                link === ""
                  ? "https://media1.tenor.com/images/817c85b86e9860dbd6d947d69ea2fee7/tenor.gif?itemid=14165517"
                  : link,
            }}
            style={{ height: 300, width: null, flex: 0 }}
            resizeMode="contain"
          />
          <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
            - Preview of your image -
          </Text>
          <Text
            style={{
              paddingTop: 30,
              ...styles.purpleText,
              alignSelf: "center",
            }}
          >
            Enter a link for your image
          </Text>
          <Input
            style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
            placeholderTextColor={"#cdcdcd"}
            value={link}
            onChangeText={(text) => setLink(text)}
            multiline
            placeholder="Any valid link"
          />
          <Text
            style={{
              paddingTop: 30,
              ...styles.purpleText,
              alignSelf: "center",
            }}
          >
            Enter a description for your image
          </Text>
          <Input
            style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
            placeholderTextColor={"#cdcdcd"}
            value={mediaDesc}
            onChangeText={(text) => setMediaDesc(text)}
            multiline
            placeholder="You can also leave this empty"
          />
          <View
            style={{
              paddingTop: 60,
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",
              justifyContent: "space-around",
            }}
          >
            <View style={{ paddingRight: 30 }}>
              <Button transparent onPress={() => closeLinkModal()}>
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-arrow-dropleft-circle"
                    style={{ fontSize: 50, color: TEXT_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.blackText,
                      fontSize: 30,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </View>
              </Button>
            </View>
            <Button
              transparent
              onPress={() => addMedia("link", link, mediaDesc)}
            >
              <View style={{ alignItems: "center" }}>
                <Icon
                  name="ios-add-circle-outline"
                  style={{ fontSize: 50, color: GENERAL_COLOR }}
                />
                <Text
                  style={{
                    ...styles.purpleText,
                    fontSize: 30,
                    textAlign: "center",
                  }}
                >
                  Add
                </Text>
              </View>
            </Button>
          </View>
        </Container>
      </Modal>
      <Modal
        animationType="slide"
        visible={filesModal}
        onRequestClose={() => setFilesModal(false)}
      >
        <Container style={generalStyle.primaryColor}>
          <View style={{ paddingTop: 20 }} />
          {file === null ? (
            <Image
              source={{
                uri:
                  link === ""
                    ? "https://media1.tenor.com/images/817c85b86e9860dbd6d947d69ea2fee7/tenor.gif?itemid=14165517"
                    : link,
              }}
              style={{ height: 300, width: null, flex: 0 }}
              resizeMode="contain"
            />
          ) : (
            []
          )}
          {file !== null && file.type === "video" ? (
            <Video
              style={{ width: 355, height: 300 }}
              source={{ uri: file.uri }}
              rate={1.0}
              volume={0.5}
              isLooping
              shouldPlay
              resizeMode="contain"
            />
          ) : file !== null ? (
            <Image
              source={{ uri: file.uri }}
              style={{ height: 300, width: null, flex: 0 }}
            />
          ) : (
            []
          )}
          <Text
            style={{
              ...styles.purpleText,
              alignSelf: "center",
              paddingBottom: 20,
            }}
          >
            - Preview of your media -
          </Text>
          <Button
            transparent
            color={GENERAL_COLOR}
            style={{ alignSelf: "center" }}
            onPress={() => {
              pickImage();
            }}
          >
            <Icon
              name="ios-folder"
              style={{ fontSize: 40, color: GENERAL_COLOR }}
            />
          </Button>
          <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
            Open files
          </Text>
          <Text
            style={{
              paddingTop: 30,
              ...styles.purpleText,
              alignSelf: "center",
            }}
          >
            Enter a description for your image
          </Text>
          <Input
            style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
            placeholderTextColor={"#cdcdcd"}
            value={mediaDesc}
            onChangeText={(text) => setMediaDesc(text)}
            multiline
            placeholder="You can also leave this empty"
          />
          <View
            style={{
              paddingTop: 60,
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",
              justifyContent: "space-around",
            }}
          >
            <View style={{ paddingRight: 30 }}>
              <Button
                transparent
                onPress={() => {
                  setFilesModal(false);
                  setFile(null);
                  setMediaDesc("");
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-arrow-dropleft-circle"
                    style={{ fontSize: 50, color: TEXT_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.blackText,
                      fontSize: 30,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </View>
              </Button>
            </View>
            <Button
              transparent
              onPress={() =>
                addMedia(file.type, file.uri, mediaDesc, file.base64)
              }
            >
              <View style={{ alignItems: "center" }}>
                <Icon
                  name="ios-add-circle-outline"
                  style={{ fontSize: 50, color: GENERAL_COLOR }}
                />
                <Text
                  style={{
                    ...styles.purpleText,
                    fontSize: 30,
                    textAlign: "center",
                  }}
                >
                  Add
                </Text>
              </View>
            </Button>
          </View>
        </Container>
      </Modal>
      <Modal
        animationType="slide"
        visible={cameraModal}
        onRequestClose={() => setCameraModal(false)}
      >
        {camera === false ? (
          <Container style={generalStyle.primaryColor}>
            <View style={{ paddingTop: 20 }} />
            <Image
              source={{
                uri:
                  link === ""
                    ? "https://media1.tenor.com/images/817c85b86e9860dbd6d947d69ea2fee7/tenor.gif?itemid=14165517"
                    : link,
              }}
              style={{ height: 300, width: null, flex: 0 }}
              resizeMode="contain"
            />
            <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
              - Preview of your image -
            </Text>
            <Button
              transparent
              color={GENERAL_COLOR}
              style={{ alignSelf: "center" }}
              onPress={() => {
                setCamera(true);
              }}
            >
              <Icon
                name="ios-camera"
                style={{ fontSize: 40, color: GENERAL_COLOR }}
              />
            </Button>
            <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
              Open camera
            </Text>
            <Text
              style={{
                paddingTop: 30,
                ...styles.purpleText,
                alignSelf: "center",
              }}
            >
              Enter a description for your image
            </Text>
            <Input
              style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
              placeholderTextColor={"#cdcdcd"}
              value={mediaDesc}
              onChangeText={(text) => setMediaDesc(text)}
              multiline
              placeholder="You can also leave this empty"
            />
            <View
              style={{
                paddingTop: 60,
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "space-around",
              }}
            >
              <View style={{ paddingRight: 30 }}>
                <Button
                  transparent
                  onPress={() => {
                    setCameraModal(false);
                    setLink("");
                    setMediaDesc("");
                    setCamera(false);
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Icon
                      name="ios-arrow-dropleft-circle"
                      style={{ fontSize: 50, color: TEXT_COLOR }}
                    />
                    <Text
                      style={{
                        ...styles.blackText,
                        fontSize: 30,
                        textAlign: "center",
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </Button>
              </View>
              <Button
                transparent
                onPress={() => {
                  addMedia(file.type, file.uri, mediaDesc, file.base64);
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-add-circle-outline"
                    style={{ fontSize: 50, color: GENERAL_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.purpleText,
                      fontSize: 30,
                      textAlign: "center",
                    }}
                  >
                    Add
                  </Text>
                </View>
              </Button>
            </View>
          </Container>
        ) : (
          <Camera
            style={{ flex: 1 }}
            ref={(ref) => setCameraRef(ref)}
            type={cameraType}
            flashMode={
              flash
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            }
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  flex: 1,
                  height: 60,
                  backgroundColor: BACKGROUND_LIGHT,
                }}
              >
                <Button
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  transparent
                  onPress={() => setCamera(false)}
                >
                  <Icon
                    name="ios-arrow-dropleft-circle"
                    style={{ fontSize: 45, color: TEXT_COLOR }}
                  />
                </Button>
                <Button
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  transparent
                  onPress={() =>
                    setCameraType(
                      cameraType === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    )
                  }
                >
                  <Icon
                    name="ios-reverse-camera"
                    style={{ fontSize: 50, color: GENERAL_COLOR }}
                  />
                </Button>
                <Button
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  transparent
                  onPress={() => takePicture()}
                >
                  <Icon
                    name="ios-camera"
                    style={{ fontSize: 50, color: GENERAL_COLOR }}
                  />
                </Button>
                <Button
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  transparent
                  onPress={() => setFlash(!flash)}
                >
                  <Icon
                    name="ios-flash"
                    style={{
                      fontSize: 40,
                      color: flash ? GENERAL_COLOR : TEXT_COLOR,
                    }}
                  />
                </Button>
              </View>
            </View>
          </Camera>
        )}
      </Modal>
      <Header
        rounded
        androidStatusBarColor={GENERAL_COLOR}
        style={generalStyle.primaryHeader}
      >
        <Text style={{ marginTop: 17, color: BACKGROUND_LIGHT }}>Upload</Text>
      </Header>
      {step === "first" ? (
        <Container style={generalStyle.primaryColor}>
          <Container
            style={{
              ...generalStyle.primaryColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button transparent onPress={() => setStep("create")}>
              <Grid>
                <Col style={{ alignItems: "center" }}>
                  <Icon
                    name="albums"
                    style={{ fontSize: 50, color: GENERAL_COLOR }}
                  />
                  <Text style={{ color: GENERAL_COLOR, fontSize: 30 }}>
                    Post an album
                  </Text>
                </Col>
              </Grid>
            </Button>
          </Container>
        </Container>
      ) : (
        []
      )}
      {step === "create" ? (
        <View style={generalStyle.primaryColor}>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
              Title of your post
            </Text>
            <Input
              style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
              placeholderTextColor={"#cdcdcd"}
              onChangeText={(text) => setPostName(text)}
              placeholder="Look at my wonderful cats"
            />
          </View>
          <View>
            <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
              Topic
            </Text>
            <Input
              style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
              placeholderTextColor={"#cdcdcd"}
              onChangeText={(text) => setTopic(text)}
              placeholder="Memes"
            />
          </View>
          <View>
            <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
              Name of your album
            </Text>
            <Input
              style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
              placeholderTextColor={"#cdcdcd"}
              onChangeText={(text) => setAlbumName(text)}
              placeholder="Cat playing League of Legends"
            />
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ ...styles.purpleText, alignSelf: "center" }}>
              Then a description
            </Text>
            <Input
              style={{ color: TEXT_COLOR, flex: 0, alignSelf: "center" }}
              placeholderTextColor={"#cdcdcd"}
              onChangeText={(text) => setAlbumDescription(text)}
              multiline
              placeholder="Description of your album"
            />
          </View>
          <View>
            <Text
              style={{
                ...styles.purpleText,
                justifyContent: "center",
                alignSelf: "center",
                paddingBottom: 10,
              }}
            >
              Is your post mature ?
            </Text>
            <Switch
              style={{ alignSelf: "center" }}
              trackColor={{ false: TEXT_COLOR, true: GENERAL_COLOR }}
              thumbColor={mature ? GENERAL_COLOR : TEXT_COLOR}
              ios_backgroundColor={GENERAL_COLOR}
              onValueChange={() => setMature(!mature)}
              value={mature}
            />
          </View>
          <View
            style={{
              paddingVertical: 80,
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <Button
              transparent
              onPress={() => {
                setStep("first");
              }}
            >
              <Icon
                name="ios-arrow-dropleft-circle"
                style={{ fontSize: 80, color: TEXT_COLOR }}
              />
            </Button>
            <Button
              transparent
              onPress={() => {
                checkPost();
              }}
            >
              <Icon
                name="ios-arrow-dropright-circle"
                style={{ fontSize: 80, color: GENERAL_COLOR }}
              />
            </Button>
          </View>
        </View>
      ) : (
        []
      )}
      {step === "createImages" ? (
        <View>
          <Text
            style={{
              ...styles.purpleText,
              fontSize: 25,
              alignSelf: "center",
              paddingVertical: 20,
            }}
          >
            Album preview
          </Text>
          <ScrollView style={{ height: 300 }}>{mediaPreview(media)}</ScrollView>
          <Text
            style={{
              ...styles.purpleText,
              fontSize: 15,
              alignSelf: "center",
              paddingVertical: 20,
            }}
          >
            - {media === null ? "0" : media.length} media to publish -
          </Text>
          <View
            style={{
              paddingTop: 10,
              display: "flex",
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ marginRight: 15 }}>
              <Button transparent onPress={() => openLinkModal()}>
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-link"
                    style={{ fontSize: 40, color: GENERAL_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.purpleText,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Add with link
                  </Text>
                </View>
              </Button>
            </View>
            <View style={{ marginRight: 9, marginLeft: 9 }}>
              <Button transparent onPress={() => setCameraModal(true)}>
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-camera"
                    style={{ fontSize: 40, color: GENERAL_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.purpleText,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Use Camera
                  </Text>
                </View>
              </Button>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Button transparent onPress={() => setFilesModal(true)}>
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-folder"
                    style={{ fontSize: 40, color: GENERAL_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.purpleText,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Add from files
                  </Text>
                </View>
              </Button>
            </View>
          </View>
          <View
            style={{
              paddingTop: 30,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ marginRight: 15 }}>
              <Button
                transparent
                onPress={() => {
                  setStep("create");
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-return-left"
                    style={{ fontSize: 35, color: TEXT_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.blackText,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </View>
              </Button>
            </View>
            <View style={{ marginLeft: 15, marginRight: 15 }}>
              <Button transparent onPress={() => setMedia(null)}>
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-trash"
                    style={{ fontSize: 35, color: GENERAL_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.purpleText,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Erase medias
                  </Text>
                </View>
              </Button>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Button transparent onPress={() => checkMedia()}>
                <View style={{ alignItems: "center" }}>
                  <Icon
                    name="ios-add-circle"
                    style={{ fontSize: 35, color: GENERAL_COLOR }}
                  />
                  <Text
                    style={{
                      ...styles.purpleText,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Publish
                  </Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      ) : (
        []
      )}
      {step === "createPublish" ? (
        <View style={{ alignItems: "center" }}>
          {creatingStep === "album" ? (
            <View style={{ alignItems: "center", paddingVertical: 180 }}>
              <Text
                style={{
                  color: GENERAL_COLOR,
                  fontSize: 25,
                  alignSelf: "center",
                  paddingVertical: 20,
                }}
              >
                Creating your album
              </Text>
              <Text
                style={{
                  color: GENERAL_COLOR,
                  fontSize: 25,
                  alignSelf: "center",
                  paddingVertical: 20,
                }}
              >
                This might take some time
              </Text>
              <Spinner color={GENERAL_COLOR} style={{ paddingVertical: 20 }} />
              <View style={{ alignSelf: "center", paddingVertical: 50 }}>
                <Button
                  transparent
                  onPress={() => {
                    setStep("createImages");
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Icon
                      name="ios-return-left"
                      style={{ fontSize: 35, color: TEXT_COLOR }}
                    />
                    <Text
                      style={{
                        ...styles.blackText,
                        fontSize: 15,
                        textAlign: "center",
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          ) : (
            []
          )}
          {creatingStep === "images" ? (
            <View style={{ alignItems: "center", paddingVertical: 180 }}>
              <Text
                style={{
                  color: GENERAL_COLOR,
                  fontSize: 25,
                  alignSelf: "center",
                  paddingVertical: 20,
                }}
              >
                Posting your album
              </Text>
              <Text
                style={{
                  color: GENERAL_COLOR,
                  fontSize: 25,
                  alignSelf: "center",
                  paddingVertical: 20,
                }}
              >
                Media published {mediaIndex + " / " + media.length}
              </Text>
              <Text
                style={{
                  color: GENERAL_COLOR,
                  fontSize: 25,
                  alignSelf: "center",
                  paddingVertical: 20,
                }}
              >
                Medias not published : {mediaErrors}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 15,
                }}
              >
                <Button
                  transparent
                  onPress={() => {
                    resetVariables();
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Icon
                      name="ios-return-left"
                      style={{ fontSize: 50, color: TEXT_COLOR }}
                    />
                    <Text
                      style={{
                        color: TEXT_COLOR,
                        fontSize: 20,
                        textAlign: "center",
                      }}
                    >
                      Go back
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          ) : (
            []
          )}
        </View>
      ) : (
        []
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  purpleText: {
    color: GENERAL_COLOR,
    fontSize: 20,
  },
  blackText: {
    color: TEXT_COLOR,
    fontSize: 20,
  },
});
