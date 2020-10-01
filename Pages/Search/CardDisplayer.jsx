import React from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

export default function CardDisplayer(props) {
  return (
    <Card>
      <CardItem listItemPadding={0}>
        <Left>
          <Thumbnail
            source={{
              uri:
                "https://vignette.wikia.nocookie.net/epita/images/2/2d/Epitech.png/revision/latest?cb=20190211235039&path-prefix=fr",
            }}
          />
          <Body>
            <Text>NativeBase</Text>
            <Text note>GeekyAnts</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image
          source={{
            uri:
              "https://www.presse-citron.net/wordpress_prod/wp-content/uploads/2017/11/Epitech-Experience-2017-projets-innovants.jpg",
          }}
          style={{ height: 200, width: null, flex: 1 }}
        />
      </CardItem>
      <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="thumbs-up" />
            <Text>12 Likes</Text>
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