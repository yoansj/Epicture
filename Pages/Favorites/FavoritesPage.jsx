import React, {useState, useEffect} from "react";
import { Text ,StyleSheet} from "react-native";
import { getUserData} from "../Authentification/AuthPage";
import { imgurGetAlbumFav } from "../../imgur.js"
import { Container, Icon, Header, Button, Item, Input} from 'native-base';
import { RenderCards } from "../Search/CardDisplayer";
import { generalStyle, GENERAL_COLOR, BACKGROUND_LIGHT } from "../../Colors";


export default function FavoritesPage() {

  // Data from the imgur api
  const [userData, setUserData] = useState(null);
  // Switches to true and false to refresh the page
  const [refresh, setRefresh] = useState(false);

  const [updateList, setUpdateList] = useState(false);

  const [flatListRef, setFlatListRef] = useState(null);

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
    <Container style={generalStyle.primaryWhite}>
      <Header rounded androidStatusBarColor={GENERAL_COLOR} style={{backgroundColor: GENERAL_COLOR}}>
        <Text style={{marginTop: 17, color: BACKGROUND_LIGHT}}>Favorites </Text>
        <Button transparent onPress={() => setRefresh(!refresh)}>
          <Icon style={{color: 'white'}} name="ios-refresh" />
        </Button>
      </Header>
      <RenderCards data={userData} setUpdateList={setUpdateList} setFlatListRef={setFlatListRef} />
      <Container style={generalStyle.contentMiddle}>
        <Icon style={styles.myloading} name="flask" />
        <Text style={styles.myloading}>Wow !</Text>
        <Text style={styles.myloading}>There is some space here</Text>
      </Container>
    </Container>
  );
}
const styles = StyleSheet.create({
  myWarning: {
    backgroundColor: 'red',
    alignItems: 'center',
    height: 60,
    justifyContent: "center"
  },
  myloading: {
    backgroundColor: '#EBEBEC',
    color: '#7E78d2'
  }
});