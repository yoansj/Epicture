import React from 'react';
import { StyleSheet } from "react-native";
import { FlatList, SafeAreaView, Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

const greenFont = "rgb(27,183,110)";
const greyFont = "#a7a7a7";

export default function CardDisplayer(props) {
  return (
    <Card style={props.style}>
      <CardItem listItemPadding={0} style={styles.myBlack}>
        <Left>
          <Thumbnail
            source={{
              uri:
                "https://vignette.wikia.nocookie.net/epita/images/2/2d/Epitech.png/revision/latest?cb=20190211235039&path-prefix=fr",
            }}
          />
          <Body>
            <Text style={{color: greenFont}}>{props.title}</Text>
            <Text note>{props.author}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image
          source={{
            uri: props.image,
          }}
          style={{ height: 200, width: null, flex: 1 }}
        />
      </CardItem>
      <CardItem style={styles.myBlack}>
        <Left>
          <Button transparent>
            <Icon active name="thumbs-up" style={{color: greenFont}}/>
            <Text  style={{color: greyFont}}>{props.ups}</Text>
          </Button>
        </Left>
        <Left>
          <Button transparent>
            <Icon style={{color: greenFont}} icon active name="thumbs-down" />
            <Text style={{color: greyFont}}>{props.downs}</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent>
            <Icon active name="eye" style={{color: greenFont}}/>
            <Text style={{color: greyFont}}>{props.views}</Text>
          </Button>
        </Right>
        <Right>
          <Button transparent>
            <Icon name="chatbubbles" style={{color: greenFont}} />
            <Text style={{color: greyFont}}>{props.comment_count}</Text>
          </Button>
        </Right>
      </CardItem>
    </Card>
  );
}

export const renderPicture = ({ item }) => {
  const { title, account_url, ups, views, downs, link, images, id, comment_count } = item;

  return (
    <CardDisplayer
      title={title}
      author={account_url}
      ups={ups}
      views={views}
      downs={downs}
      comment_count={comment_count}
      image={images ? images[0].link : link}
      key={id}
    />
  );
}

export function renderCards(data) {
  if (data === null) {
    return (
      <Container style={styles.myMiddle}>
        <Icon style={styles.myBlack} name="flask" />
        <Text style={styles.myBlack}>Do a research</Text>
      </Container>
    )
  } else {
  return (
    <SafeAreaView>
      <FlatList data={data} renderItem={renderPicture} />
    </SafeAreaView>
  );
  }
}

const styles = StyleSheet.create({
  myMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(18,18,18)",
  },
  myGreen:{
    backgroundColor: 'rgb(27,183,110)'
  },
  myBlack: {
    backgroundColor: 'rgb(18,18,18)',
    color: 'rgb(27,183,110)'
  }
});

// title = titre
// ups = upvotes
// views = nb vues
// downs = downvotes