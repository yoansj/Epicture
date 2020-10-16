import React, { useState , useEffect} from "react";
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
import { imgurSearch , imgurAccountSubmission, imgurGallery} from "../../imgur";
import { getUserData } from "../Authentification/AuthPage";

/**
 * SearchPage component which renders the Search Page
 * Has the SearchBar sub-component
 * @example <SearchPage />
 */
export default function SearchPage() {

  // Can be pictures || albums || users
  const [searchPicker, setSearchPicker] = useState("albums");
  // Can be time || viral || top || random
  const [sortPicker, setSortPicker] = useState("top");
  // Can be day || week || month || year || all
  const [windowPicker, setwindowPicker] = useState("all");
  // Can be hot || top || user
  const [sectionPicker, setSectionPicker] = useState("hot");
  // Data from imgur API
  const [imgurData, setImgurData] = useState(null);
  // Search string
  const [text, setText] = useState("");

  const [firstSearch, setFirstSearch] = useState(false);


  useEffect(() => {
    if (searchPicker === "myPost") {
      getUserData().then((value) => {
        console.log(value);
        imgurAccountSubmission(value.acess_token).then((value) => {
          setImgurData(value.data);
        });
      });
    }
    if (searchPicker === "pictures") {
      getUserData().then((value) => {
        imgurSearch(value.acess_token, sortPicker, windowPicker, 0, text).then(
          (value) => {
            setImgurData(value.data);
          }
        );
      });
    }
    if (searchPicker === "albums") {
      getUserData().then((value) => {
        imgurGallery(value.acess_token, sectionPicker, sortPicker, windowPicker, "true").then(
          (value) => {
            setImgurData(value.data);
          }
        );
      });
    }
    if (firstSearch === false) {
      getUserData().then((value) => {
        imgurGallery(value.acess_token, "hot", "top", "all", "true").then(
          (value) => {
            setImgurData(value.data);
          }
        );
      });
      setFirstSearch(true);
    }
  }, [searchPicker, sortPicker, windowPicker, sectionPicker]);

  /**
   * Function called when the user searches
   * Takes a text param which is the query searched by the user
   * The result of the search is stored in the imgurData state
   * @param {*} text
   * @example doSearch("cats") 
   */
  function doSearch(text) {
    if (searchPicker === "pictures") {
      getUserData().then((value) => {
        imgurSearch(value.acess_token, sortPicker, windowPicker, 0, text).then(
          (value) => {
            setImgurData(value.data);
          }
        );
      });
    }
    if (searchPicker === "albums") {
      getUserData().then((value) => {
        imgurGallery(value.acess_token, sectionPicker, sortPicker, windowPicker, "true").then(
          (value) => {
            setImgurData(value.data);
          }
        );
      });
    }
  }

  return (
    <Container style={styles.myBlack}>
      <Header
        androidStatusBarColor="rgb(1,1,1)"
        style={{
          flexDirection: "column",
          height: 100,
          backgroundColor: "rgb(1,1,1)",
        }}
        searchBar
        rounded
      >
        <Item style={styles.myGreen}>
          <Icon name="ios-search" />
          <Input
            placeholder="Search"
            value={text}
            onChangeText={(txt) => setText(txt)}
            onSubmitEditing={() => doSearch(text)}
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
              onValueChange={(value) => {
                setSearchPicker(value);
              }}
              placeholder="Search"
              textStyle={{fontSize: 5}}
            >
              <Picker.Item label="Pictures" value="pictures" />
              <Picker.Item label="Albums" value="albums" />
              <Picker.Item label="Users" value="users" />
              <Picker.Item label="My posts" value="myPost" />
            </Picker>
          </Col>
          {searchPicker === "albums" ? (
            <Col>
              <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={sectionPicker}
                onValueChange={(value) => {
                  setSectionPicker(value);
                }}
              >
                <Picker.Item label="Hot" value="hot" />
                <Picker.Item label="Top" value="top" />
                <Picker.Item label="User" value="user" />
              </Picker>
            </Col>
          ) : (
            []
          )}
          {searchPicker === "pictures" || searchPicker === "albums" ? (
            <Col>
              <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={sortPicker}
                onValueChange={(value) => {
                  setSortPicker(value);
                }}
              >
                <Picker.Item label="Most Viral" value="viral" />
                <Picker.Item label="By date" value="time" />
                <Picker.Item label="Hightest Scoring" value="top" />
                <Picker.Item label="Random" value="random" />
              </Picker>
            </Col>
          ) : (
            []
          )}
          {sortPicker === "top" && (searchPicker === "pictures" || searchPicker === "albums") ? (
            <Col style={{ height: 50 }}>
              <Picker
                mode="dropdown"
                style={styles.myPickerGreen}
                selectedValue={windowPicker}
                onValueChange={(value) => {
                  setwindowPicker(value);
                }}
              >
                <Picker.Item label="Day" value="day" />
                <Picker.Item label="Week" value="week" />
                <Picker.Item label="Month" value="month" />
                <Picker.Item label="Year" value="year" />
                <Picker.Item label="All Time" value="all" />
              </Picker>
            </Col>
          ) : (
            []
          )}
        </Grid>
      </Header>
      {renderCards(imgurData)}
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
