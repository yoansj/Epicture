import React from "react";
import { View, StyleSheet } from "react-native";
//import {Picker} from '@react-native-community/picker';
import { TextInput } from 'react-native';
import * as Font from 'expo-font';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { Title, Right, Body, Left, Picker, Form ,Card, CardItem, Thumbnail, Image} from "native-base";

export default function SearchPage() {
  return (
    <View style={{ flexWrap: "wrap", alignContent: "flex-start" }}>
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
      </Container>
      <Grid>
        <Col style={{ height: 100, marginTop: 25 }}>
          <Picker mode="dropdown" style={{ width: undefined }}>
            <Picker.Item label="Most Viral" value="key_left0" />
            <Picker.Item label="User Submitted" value="key_left1" />
            <Picker.Item label="Hightest Scoring" value="key_left2" />
          </Picker>
        </Col>
        <Col style={{ height: 100, marginTop: 25 }}>
          <Picker mode="dropdown" style={{ width: undefined }}>
            <Picker.Item label="Popular" value="key_right0" />
            <Picker.Item label="Newest" value="key_right1" />
            <Picker.Item label="Best" value="key_right2" />
            <Picker.Item label="Random" value="key_right3" />
          </Picker>
        </Col>
      </Grid>

    </View>
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
    height: "45%"
  },
  scrolLeft: {
    textAlign: "center",
    height: 20,
    width: 175,
  },
  myBar: {
    marginLeft: 80,
    marginTop: 60,
    width: 200,
    height: 40,
    borderColor: 'black',
    backgroundColor: "#808B96",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderWidth: 1 , alignSelf: "center"
  },
});