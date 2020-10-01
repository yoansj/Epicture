import React, {useState} from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Col, Grid } from 'react-native-easy-grid';
import { Picker , Item, Icon, Button, Text, Input, Container, Header} from "native-base";
import CardDisplayer from "./CardDisplayer";

export default function SearchPage() {

  const [leftPicker, setLeftPicker] = useState("Most Viral");
  const [rightPicker, setRightPicker] = useState("Popular");

  const [searchText, setSearchText] = useState("League of legends")

  function SearchBar() {
    return (
      <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}/>
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </Header>
      <Grid>
        <Col style={{ height: 50}}>
          <Picker
            mode="dropdown"
            style={{ width: undefined }}
            selectedValue={leftPicker}
            onValueChange={(value) => setLeftPicker(value)}
          >
            <Picker.Item label="Most Viral" value="key_left0" />
            <Picker.Item label="User Submitted" value="key_left1" />
            <Picker.Item label="Hightest Scoring" value="key_left2" />
          </Picker>
        </Col>
        <Col style={{ height: 50}}>
          <Picker
            mode="dropdown"
            style={{ width: undefined }}
            selectedValue={rightPicker}
            onValueChange={(value) => setRightPicker(value)}
          >
            <Picker.Item label="Popular" value="key_right0" />
            <Picker.Item label="Newest" value="key_right1" />
            <Picker.Item label="Best" value="key_right2" />
            <Picker.Item label="Random" value="key_right3" />
          </Picker>
        </Col>
      </Grid>
      <ScrollView automaticallyAdjustContentInsets={false} contentContainerStyle={{flexGrow: 1, flexDirection: 'column'}} style={{paddingVertical: 55}}>
        <CardDisplayer />
        <CardDisplayer />
      </ScrollView>
    </Container>
    )
  }

  return (
    <Container>
      <SearchBar />
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