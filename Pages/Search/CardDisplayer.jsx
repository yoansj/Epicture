import React, { useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Image , Modal, ScrollView, RefreshControl, Pressable} from 'react-native';
import { Container, Header, Spinner, Content, Card, CardItem, Input, Text, Button, Icon, Left, Body, Right, View, Toast } from 'native-base';
import { Video } from 'expo-av';

import { imgurAlbum, imgurAlbumVote, imgurAlbumFavorite, imgurGetCom, imgurCommentVote, imgurCommentCreate } from '../../imgur';
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
  // to know if data is loading
  const [refreshing, setRefreshing] = useState(false);
  // new comment being written
  const [comment, setComment] = useState("");
  // comment from the post
  const [postCom, setPostCom] = useState(null);
  // is posting comment
  const [posting, setPosting] = useState(false);
  // comment post worked
  const [commentWorked, setCommentWorked] = useState(null);

  const [commentModal, setCommentModal] = useState(false);

  function getPost(id) {
    getUserData().then((user) => {
      imgurAlbum(user.acess_token, id).then((value) =>
        {
          setPostData(value.data);
          imgurGetCom(user.acess_token, id).then((com) =>
            {setPostCom(com.data); setRefreshing(false)}
          );
        }
      );
    });
  }

  function refreshModal() {
    setRefreshing(true);
    getPost(props.id);
  }

  function openModal() {
    setPlaying(false);
    setShowModal(true);
    setRefreshing(true);
    getPost(props.id)
  }

  function doVote(user_vote) {
    getUserData().then((value) => {
      console.log("DEBUG:", props.id, user_vote, vote);
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

  function postComment() {
    setPosting(true);
    getUserData().then((value) =>
      imgurCommentCreate(value.acess_token, props.id, comment, null).then((value) => {
        setPosting(false);
        if (value.data.success) {
          setCommentWorked(true);
        } else {
          setCommentWorked(false);
        }
      })
    );
  }

  function ImagesDisplayer() {
    if (postData && postData.images && !refreshing) {
      return (
        postData.images.map((img, index) => {

          const [videoPlaying, setVideoPlaying] = useState(false);

          return (
          <View key={index}>
            {img.type === "video/mp4" ?
            <Button
            onPress={() => setVideoPlaying(!videoPlaying)}
            transparent
            style={{ width: 355, height: 280 }}
            >
              <Container style={{ width: 355, height: undefined }}>
                <Video
                  source={{ uri: img.link }}
                  rate={1.0}
                  volume={videoPlaying ? 1.0 : 0.0}
                  isLooping
                  shouldPlay={videoPlaying}
                  style={{ width: 355, height: 280 }}
                  resizeMode="contain"
                />
              </Container>
            </Button>
            :
            <Image
              source={{ uri: img.link }}
              style={{ height: 400, flex: 1, marginTop: 40}}
              resizeMode="contain"
            />
            }
            <Text style={{textAlign: "center", color: GENERAL_COLOR}}>{img.title ? img.title + "\n" : ""}{img.description}</Text>
          </View>)
        })
      )
    } else {
      return (
        <View>
        </View>
      )
    }
  }

  /**
   * This component is used to display the comments of a post
   * It is rendered inside a modal and inside a ScrollView
   */
  function CommentDisplayer() {

    if (postCom && !refreshing) {
      return (
        <View style={{paddingTop: 30}}>
          <View style={{...generalStyle.contentMiddle, backgroundColor: BACKGROUND_LIGHT, flexDirection: "row"}}>
            <Icon fontSize={20} name="chatbubbles" style={{...generalStyle.primaryColor, marginRight: 25}} />
            <Text style={{...generalStyle.primaryColor, fontSize: 25}}>
              Comment section
            </Text>
            <Icon fontSize={20} name="chatbubbles" style={{...generalStyle.primaryColor, marginLeft: 25}} />
          </View>
          <View style={{margin: 10}}>
            <Button onPress={() => setCommentModal(true)} style={{alignSelf: "center", backgroundColor: GENERAL_COLOR}} rounded color={GENERAL_COLOR}>
              <Text>Add comment</Text>
            </Button>
          </View>
          {postCom.map((comment, index) => {

            const [commentVote, setCommentVote] = useState(comment.vote);

            function doVoteComment(user_vote) {
              getUserData().then((value) => {
                console.log("DEBUG:", props.id, user_vote, vote);
                if (vote === user_vote) {
                  imgurCommentVote(value.acess_token, comment.id, "veto").then(value => {console.log("Veto worked !"); setCommentVote(null)})
                } else {
                  imgurCommentVote(value.acess_token, comment.id, user_vote).then(value => {console.log(`Vote ${user_vote} worked !`); setCommentVote(user_vote)})
                }
              });
            }

            return (
              <Card key={index}>
                <CardItem>
                  <Text style={styles.myAuth}>{comment.author} :</Text>
                </CardItem>
                <CardItem cardBody>
                  <Text style={{...styles.myCom, marginLeft: 15}}>{comment.comment}</Text>
                </CardItem>
                <CardItem>
                  <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Button transparent onPress={() => doVoteComment("up")}>
                      <Icon
                        active
                        name="thumbs-up"
                        style={{ color: commentVote === "up" ? "#2ECC71" : purleFont, fontSize: 25}}
                      />
                      <Text
                        style={{ color: commentVote === "up" ? "#2ECC71" : greyFont }}
                      >
                        {comment.ups}
                      </Text>
                    </Button>
                  </Left>
                  <Left style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Button transparent onPress={() => doVoteComment("down")}>
                      <Icon
                        style={{ color: commentVote=== "down" ? "#2ECC71" : purleFont, fontSize: 25 }}
                        icon
                        active
                        name="thumbs-down"
                      />
                      <Text
                        style={{ color: commentVote === "down" ? "#2ECC71" : greyFont }}
                      >
                        {comment.downs}
                      </Text>
                    </Button>
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
        </View>
      );
    }
  }

  function frontCardDisplay() {
    if (props.images && props.images[0].type === "video/mp4" && !props.nsfw) {
      return (
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
      )
    } else if (props.images && props.images[0].type === "video/mp4" && props.nsfw) {
      return (
        <Pressable onPress={() => openModal()}>
          <View style={{ width: 355, height: 280, backgroundColor: "#dfdfdf" , alignItems: "center", justifyContent: 'center'}}>
            <Text
              style={{
                color: GENERAL_COLOR,
                justifyContent: "center",
                alignSelf: "center",
                textAlign: "center",
                fontSize: 30
              }}
            >
              This video is mature touch to see it
            </Text>
          </View>
        </Pressable>
      );
    } else {
      return (
        <Button
        onPress={() => {openModal()}}
        transparent
        style={{ width: 355, height: 280 }}
      >
        <Container style={{ width: 200, height: undefined, flex: 1 }}>
          <Image
            source={{
              uri: props.image,
            }}
            style={{ height: 200, flex: 1}}
            resizeMode="contain"
            blurRadius={(props.nsfw ? 5 : 0)}
          />
        </Container>
      </Button>
      )
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
          <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} colors={['#7E78d2']} onRefresh={() => refreshModal()} />
          }>
            {props.description ? <Text style={{ marginTop: 17, color: GENERAL_COLOR }}>
              {props.description}
            </Text> : []}
            <ImagesDisplayer />
            <CommentDisplayer />
          </ScrollView>
          <Modal
            animationType="slide"
            transparent
            visible={commentModal}
            onRequestClose={() => setCommentModal(false)}>
            <Header
              rounded
              androidStatusBarColor={BACKGROUND_COLOR}
              style={{ backgroundColor: GENERAL_COLOR }}
            >
              <Text style={{ marginTop: 17, color: BACKGROUND_LIGHT }}>
                Add comment
              </Text>
            </Header>
              <Container style={{ backgroundColor: BACKGROUND_LIGHT, paddingTop: 20 }}>
                <Input
                  multiline
                  placeholder="Add your comment about cats"
                  placeholderTextColor={"#cdcdcd"}
                  onChangeText={(text) => setComment(text)}
                  style={{margin: 10, borderColor: GENERAL_COLOR, borderWidth: 1, borderRadius: 10, maxHeight: 500}}
                  />
                <Button onPress={() => postComment()} style={{alignSelf: "center", backgroundColor: GENERAL_COLOR, margin: 20}} rounded>
                  {posting === false && commentWorked === null ?
                  <Text>Post comment</Text>
                  : posting === true ?
                  <Spinner style={{width: 100}} color={TEXT_COLOR} />
                  : []
                  }
                  {commentWorked === true ?
                    <Icon style={{ color: "#2ECC71", fontSize: 40}}
                      icon
                      active
                      name="checkmark-circle"
                    />
                    : commentWorked === false ?
                    <Icon style={{ color: TEXT_COLOR, fontSize: 40}}
                    icon
                    active
                    name="alert"
                    />
                    : []
                  }
                </Button>
                <Button onPress={() => {setCommentModal(false); setCommentWorked(null); setPosting(false)}} style={{alignSelf: "center", backgroundColor: TEXT_COLOR,}} rounded>
                  <Text>Cancel</Text>
                </Button>
              </Container>
            </Modal>
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
            {
              props.nsfw ?
                <Icon active name="alert" style={{ color: purleFont }} />
              : []
            }
          </Content>
        </Right>
      </CardItem>
      <CardItem cardBody>
        {frontCardDisplay()}
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
              {props.ups}
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
              {props.downs}
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
            onPress={() => {openModal()}}
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
  const { title, account_url, ups, views, downs, link, images, id, comment_count, vote, favorite, images_count, description, nsfw } = item;
  
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
      nsfw={nsfw}
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
          refreshControl={
            <RefreshControl refreshing={(props.refreshing ? props.refreshing : false)}
            colors={['#7E78d2']}   onRefresh={() => {props.onRefresh()}}/>
          }
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