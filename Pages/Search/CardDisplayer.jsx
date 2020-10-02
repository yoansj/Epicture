import React from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default function CardDisplayer(props) {
  return (
    <Card style={props.style}>
      <CardItem listItemPadding={0}>
        <Left>
          <Thumbnail
            source={{
              uri:
                "https://vignette.wikia.nocookie.net/epita/images/2/2d/Epitech.png/revision/latest?cb=20190211235039&path-prefix=fr",
            }}
          />
          <Body>
            <Text>{props.title}</Text>
            <Text note>GeekyAnts</Text>
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
      <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="thumbs-up" />
            <Text>{props.ups}</Text>
          </Button>
        </Left>
        <Body>
          <Button transparent>
            <Icon active name="chatbubbles" />
            <Text>4 Comments</Text>
          </Button>
        </Body>
        <Right>
          <Text>11h ago</Text>
        </Right>
      </CardItem>
    </Card>
  );
}

export function cardRenderer(data) {
  if (data === null) {
    return <Text>Please do a search</Text>;
  } else {
    return data.map((image, id) => {
      return (<CardDisplayer
        title={image.title}
        ups={image.ups}
        views={image.views}
        downs={image.downs}
        image={image.images ? image.images[0].link : image.link}
        key={id}
      />);
    });
  }
}

// title = titre
// ups = upvotes
// views = nb vues
// downs = downvotes