import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import {
  Picker,
  Item,
  Icon,
  Button,
  Text,
  Input,
  Container,
  Header,
} from "native-base";
import { renderCards } from "./CardDisplayer";
import { imgurSearch } from "../../imgur";

export default function SearchPage() {
  const [searchPicker, setSearchPicker] = useState("pictures");
  const [sortPicker, setSortPicker] = useState("random");

  const [leftPicker, setLeftPicker] = useState("Most Viral");
  const [searchText, setSearchText] = useState("League of legends");
  const [imgurData, setImgurData] = useState(null);

  function doSearch(text) {
    imgurSearch().then((value) => {
      setImgurData(value.data);
      console.log(JSON.stringify(value));
    });
  }

  function SearchBar() {
    return (
      <Container style={styles.myBlack}>
        <Header
          androidStatusBarColor='rgb(1,1,1)'
          style={{ flexDirection: "column", height: 100 , backgroundColor: 'rgb(1,1,1)'}}
          searchBar
          rounded
        >
          <Item style={styles.myGreen}>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
              onSubmitEditing={(event) => doSearch(event.nativeEvent.text)}
            />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
          <Grid>
            <Col style={{ height: 50 }}>
              <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={searchPicker}
                onValueChange={(value) => setSearchPicker(value)}
                placeholder="Search"
              >
                <Picker.Item label="Pictures" value="pictures" />
                <Picker.Item label="Albums" value="albums" />
                <Picker.Item label="Users" value="users" />
              </Picker>
            </Col>
            {searchPicker === "pictures" ?
              <Col>
                <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={leftPicker}
                onValueChange={(value) => setLeftPicker(value)}
              >
                <Picker.Item label="Most Viral" value="key_left0" />
                <Picker.Item label="User Submitted" value="key_left1" />
                <Picker.Item label="Hightest Scoring" value="key_left2" />
              </Picker>
              </Col>
              : []
            }
            <Col style={{ height: 50 }}>
              <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={leftPicker}
                onValueChange={(value) => setLeftPicker(value)}
              >
                <Picker.Item label="Most Viral" value="key_left0" />
                <Picker.Item label="User Submitted" value="key_left1" />
                <Picker.Item label="Hightest Scoring" value="key_left2" />
              </Picker>
            </Col>
            <Col style={{ height: 50 }}>
              <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={sortPicker}
                onValueChange={(value) => setSortPicker(value)}
              > 
                <Picker.Item label="Popular" value="viral" />
                <Picker.Item label="Newest" value="time" />
                <Picker.Item label="Best" value="top" />
                <Picker.Item label="Random" value="random" />
              </Picker>
            </Col>
          </Grid>
        </Header>
        {renderCards(imgurData)}
      </Container>
    );
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
