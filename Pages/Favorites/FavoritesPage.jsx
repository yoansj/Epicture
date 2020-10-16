import React, {useState, useEffect} from "react";
import { Text ,StyleSheet} from "react-native";
import { getUserData} from "../Authentification/AuthPage";
import { imgurGetAlbumFav } from "../../imgur.js"
import { Container, Icon, Header, Button, Item, Input} from 'native-base';
import { renderCards } from "../Search/CardDisplayer";

export default function FavoritesPage() {

  // Data from the imgur api
  const [userData, setUserData] = useState(null);
  // Switches to true and false to refresh the page
  const [refresh, setRefresh] = useState(false);

  const [test, setTest] = useState("");

  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurGetAlbumFav(value.acess_token, value.username).then((value) => {
        setUserData(value.data);
      });
    });
  }, [refresh]);

  return (
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input value={test} onChangeText={text => setTest(text)} placeholder="Search" />
          <Icon name="ios-people" />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </Header>
    </Container>
  );

  return (
    <Container style={styles.myBlack}>
      <Header rounded androidStatusBarColor='black' style={{backgroundColor: 'black'}}>
        <Text style={{marginTop: 17, color: 'rgb(27,183,110)'}}>Favorites </Text>
        <Button transparent onPress={() => setRefresh(!refresh)}>
          <Icon style={styles.myBlack} name="ios-refresh" />
        </Button>
      </Header>
      {renderCards(userData)}
      <Container style={styles.myMiddle}>
        <Icon style={styles.myBlack} name="flask" />
        <Text style={styles.myBlack}>Wow !</Text>
        <Text style={styles.myBlack}>There is some space here</Text>
      </Container>
    </Container>
  );
}
const styles = StyleSheet.create({
  myMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(18,18,18)",
  },
  myWarning: {
    backgroundColor: 'red',
    alignItems: 'center',
    height: 60,
    justifyContent: "center"
  },
  myGreen:{
    backgroundColor: 'rgb(27,183,110)'
  },
  myBlack: {
    backgroundColor: 'rgb(18,18,18)',
    color: 'rgb(27,183,110)'
  }
});