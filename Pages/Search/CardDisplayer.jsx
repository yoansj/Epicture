import React, { useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Image , Modal, ScrollView} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Spinner, Text, Button, Icon, Left, Body, Right, View } from 'native-base';
import { Video } from 'expo-av';

import { imgurAlbum, imgurAlbumVote, imgurAlbumFavorite, imgurGetCom } from '../../imgur';
import { getUserData } from '../Authentification/AuthPage';
import { generalStyle, GENERAL_COLOR, BACKGROUND_LIGHT, TEXT_COLOR, BACKGROUND_COLOR } from "../../Colors";

const purleFont = "#7E78d2";
const greyFont = "#0C0C0C";

/**
 * CardDisplayer component to display Images, Profiles and Galleries
 * @param {} props
 * @example
 * return (<CardDisplayer title={title} author={account_url} ups={ups} views={views} image={images ? images[0].link : link} id={id} key={id} />); 
 */
export default function CardDisplayer(props) {

  // vote (upvote or downvote)
  const [vote, setVote] = useState(props.vote);
  // favorite (know if user has favorited post)
  const [favorite, setFavorite] = useState(props.favorite);
  // is video playing
  const [playing, setPlaying] = useState(false);
   // is modal shown
  const [showModal, setShowModal] = useState(false);
  // data form the post
  const [postData, setPostData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  // comment from the post
  const[postCom, setPostCom] = useState(null);

  function getPostData(id) {
    getUserData().then((value) => {
      imgurAlbum(value.acess_token, id).then((value) =>
        {setPostData(value.data);}
      );
    });
  }

  function getPostCom(id) {
    getUserData().then((value) => {
      imgurGetCom(value.acess_token, id).then((value) =>
        {setPostCom(value.data);}
      );
    });
  }

  function doVote(user_vote) {
    getUserData().then((value) => {
      if (vote === user_vote) {
        imgurAlbumVote(value.acess_token, props.id, "veto").then(value => {console.log("Veto worked !"); setVote(null)})
      } else {
        imgurAlbumVote(value.acess_token, props.id, user_vote).then(value => {console.log(`Vote ${user_vote} worked !`); setVote(user_vote)})
      }
    });
  }

  function doFavorite() {
    getUserData().then((value) =>
      imgurAlbumFavorite(value.acess_token, props.id).then((value) => {
        setFavorite(!favorite);
        console.log("Favorite worked !");
      })
    );
  }

  function ImagesDisplayer() {
    if (postData && postData.images && isLoading === false) {
      return (
        postData.images.map((img, index) => {
          return (
          <View key={index}>
            <Image
              source={{ uri: img.link }}
              style={{ height: 400, width: null, marginTop: 40 }}
            />
            <Text style={{textAlign: "center", color: GENERAL_COLOR}}>{img.title ? img.title + "\n" : ""}{img.description}</Text>
          </View>)
        })
      )
    } else {
      return (
        <View>
          <Spinner color={GENERAL_COLOR} />
        </View>
      )
    }
  }

  /**
   * Display comment
   */
  function CommentDisplayer() {
    if (postCom) {
      return (
        <View>
          <Text style={generalStyle.primaryColor}>
            <Icon name="chatbubbles" style={generalStyle.primaryColor} />
            Comment section
            <Icon name="chatbubbles" style={generalStyle.primaryColor} />
          </Text>
          {postCom.map((comment, index) => {
            return (
              <Card key={index}>
                <CardItem>
                  <Text style={styles.myAuth}>{comment.author} :</Text>
                </CardItem>
                <CardItem cardBody>
                  <Text style={styles.myCom}> {comment.comment} </Text>
                </CardItem>
                <CardItem>
                  <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Icon
                      active
                      name="thumbs-up"
                      style={{ color: comment.ups === "up" ? "#2ECC71" : purleFont }}
                    />
                    <Text
                      style={{ color: comment.ups === "up" ? "#2ECC71" : greyFont }}
                    >
                      {comment.ups + (vote === "up" ? 1 : 0)}
                    </Text>
                  </Left>
                  <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Icon
                      style={{ color: vote === "down" ? "#2ECC71" : purleFont }}
                      icon
                      active
                      name="thumbs-down"
                    />
                    <Text
                      style={{ color: vote === "down" ? "#2ECC71" : greyFont }}
                    >
                      {comment.downs + (vote === "down" ? 1 : 0)}
                    </Text>
                  </Left>
                </CardItem>
              </Card>
            );
          })}
        </View>
      );
    } else {
      return (
        <View>
          <Spinner color={GENERAL_COLOR} />
        </View>
      );
    }
  }

  return (
    <Card style={props.style}>
      <Modal
        animationType="slide"
        transparent
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <Container style={{ backgroundColor: BACKGROUND_LIGHT }}>
          <Header
            rounded
            androidStatusBarColor={BACKGROUND_COLOR}
            style={{ backgroundColor: GENERAL_COLOR }}
          >
            <Button transparent onPress={() => setShowModal(false)}>
              <Text style={{ textAlign: "center" }}>
                <Icon
                  style={{ color: BACKGROUND_COLOR }}
                  name="arrow-dropleft-circle"
                />
              </Text>
            </Button>
            <Text style={{ marginTop: 17, color: BACKGROUND_LIGHT }}>
              {props.title}
            </Text>
          </Header>
          <ScrollView>
            {props.description ? <Text style={{ marginTop: 17, color: GENERAL_COLOR }}>
              {props.description}
            </Text> : []}
            {<ImagesDisplayer />}
            <CommentDisplayer/>
          </ScrollView>
        </Container>
      </Modal>
      <CardItem listItemPadding={0} style={generalStyle.primaryColor}>
        <Left>
          <Body>
            <Text style={{ color: purleFont }}>{props.title}</Text>
            <Text note style={{color: TEXT_COLOR}}>{props.author}</Text>
          </Body>
        </Left>
        <Right>
          <Content>
            {props.images_count > 1 ? (
              <Icon active name="albums" style={{ color: purleFont }} />
            ) : (
              []
            )}
            {props.images && props.images[0].type === "video/mp4" ? (
              <Icon active name="videocam" style={{ color: purleFont }} />
            ) : (
              []
            )}
          </Content>
        </Right>
      </CardItem>
      <CardItem cardBody>
        {props.images && props.images[0].type === "video/mp4" ? (
          <Button
            onPress={() => setPlaying(!playing)}
            transparent
            style={{ width: 355, height: 280 }}
          >
            <Container style={{ width: 355, height: undefined }}>
              <Video
                source={{ uri: props.images[0].link }}
                rate={1.0}
                volume={playing ? 1.0 : 0.0}
                isLooping
                shouldPlay={playing}
                style={{ width: 355, height: 280 }}
                resizeMode="contain"
              />
            </Container>
          </Button>
        ) : (
          <Image
            source={{
              uri: props.image,
            }}
            style={{ height: 200, flex: 1 }}
            resizeMode="contain"
          />
        )}
      </CardItem>
      <CardItem style={generalStyle.primaryColor}>
        <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <Button onPress={() => doVote("up")} transparent>
            <Icon
              active
              name="thumbs-up"
              style={{ color: vote === "up" ? "#2ECC71" : purleFont }}
            />
            <Text style={{ color: vote === "up" ? "#2ECC71" : greyFont }}>
              {props.ups + (vote === "up" ? 1 : 0)}
            </Text>
          </Button>
        </Left>
        <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <Button onPress={() => doVote("down")} transparent>
            <Icon
              style={{ color: vote === "down" ? "#2ECC71" : purleFont }}
              icon
              active
              name="thumbs-down"
            />
            <Text style={{ color: vote === "down" ? "#2ECC71" : greyFont }}>
              {props.downs + (vote === "down" ? 1 : 0)}
            </Text>
          </Button>
        </Left>
        <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Content>
          <Button transparent onPress={() => doFavorite()}>
            <Icon
              style={{ fontSize: 25, color: purleFont }}
              icon
              active
              name={favorite === false ? "md-heart-empty" : "md-heart"}
            />
          </Button>
        </Content>
        </Left>
        <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <Button
            transparent
            onPress={() => {
              setShowModal(true);
              getPostData(props.id);
              getPostCom(props.id);
            }}
          >
            <Icon name="chatbubbles" style={{ color: purleFont }} />
            <Text style={{ color: greyFont }}>{props.comment_count}</Text>
          </Button>
        </Left>
        <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <Icon active name="eye" style={{ color: purleFont }} />
          <Text style={{ color: greyFont, fontSize: 15 }}>{props.views}</Text>
        </Left>
      </CardItem>
    </Card>
  );
}

/**
 * This function is used by the renderCards FlatList component
 * 
 * @param {*} item
 */
export const renderPicture = ({ item }) => {
  const { title, account_url, ups, views, downs, link, images, id, comment_count, vote, favorite, images_count, description } = item;

  //console.log(item.images);

  return (
    <CardDisplayer
      title={title}
      author={account_url}
      ups={ups}
      views={views}
      downs={downs}
      comment_count={comment_count}
      image={images ? images[0].link : link}
      images={item.images}
      id={id}
      vote={vote}
      favorite={favorite}
      images_count={images_count}
      description={description}
      key={id}
    />
  );
}

export function RenderCards(props) {
  if (props.data === null || props.data.length === 0) {
    return (
      <Container style={styles.myMiddle}>
        <Icon style={generalStyle.primaryColor} name="flask" />
        <Text style={generalStyle.primaryColor}>What are you looking for ?</Text>
      </Container>
    )
  } else {
  return (
    <SafeAreaView>
      <FlatList
        data={props.data}
        renderItem={renderPicture}
        onEndReached={() => {
          if (props.onEnd)
            props.onEnd()
        }}
        ref={(ref) => {
          if (props.setFlatListRef)
            props.setFlatListRef(ref);
        }}
      />
    </SafeAreaView>
  );
  }
}

const styles = StyleSheet.create({
  myMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F1",
  },
  myBlackText: {
    flex: 1,
    textAlign: "center",
    backgroundColor: 'rgb(18,18,18)',
    color: GENERAL_COLOR
  },
  myAuth: {
    flex: 1,
    color: '#7E78d2'
  },
  myCom: {
    flex: 1,
    color: '#0C0C0C'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color : "red"
  }
});

// title = titre
// ups = upvotes
// views = nb vues
// downs = downvotes