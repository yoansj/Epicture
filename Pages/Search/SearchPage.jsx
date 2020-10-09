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
import { getUserData } from "../Authentification/AuthPage";

/**
 * SearchPage component which renders the Search Page
 * Has the SearchBar sub-component
 * @example <SearchPage />
 */
export default function SearchPage() {

  // Can be pictures || albums || users
  const [searchPicker, setSearchPicker] = useState("pictures");
  // Can be time || viral || top || random
  const [sortPicker, setSortPicker] = useState("time");
  // Can be day || week || month || year || all
  const [windowPicker, setwindowPicker] = useState("all");
  // Data from imgur API
  const [imgurData, setImgurData] = useState(null);

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
  }

  /**
   * Sub component of the SearchPage component
   * Renders a search bar and some pickers
   * @example
   * <Container>
      <SearchBar />
    </Container>
   */
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
                  selectedValue={sortPicker}
                  onValueChange={(value) => setSortPicker(value)}
                >
                  <Picker.Item label="Most Viral" value="viral" />
                  <Picker.Item label="By date" value="time" />
                  <Picker.Item label="Hightest Scoring" value="top" />
                  <Picker.Item label="Random" value="random" />
                </Picker>
              </Col>
              : []
            }
            {sortPicker === "top" && searchPicker === "pictures" ?
              <Col style={{ height: 50 }}>
                <Picker
                  mode="dropdown"
                  style={styles.myPickerGreen}
                  selectedValue={windowPicker}
                  onValueChange={(value) => setwindowPicker(value)}
                >
                  <Picker.Item label="Day" value="day" />
                  <Picker.Item label="Week" value="week" />
                  <Picker.Item label="Month" value="month" />
                  <Picker.Item label="Year" value="year" />
                  <Picker.Item label="All Time" value="all" />
                </Picker>
              </Col>
              : []
            }
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
