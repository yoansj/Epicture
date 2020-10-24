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

  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurGetAlbumFav(value.acess_token, value.username).then((value) => {
        setUserData(value.data);
        setRefresh(false);
      });
    });
  }, [refresh]);

  return (
    <Container style={generalStyle.primaryColor}>
      <Header rounded androidStatusBarColor={GENERAL_COLOR} style={{backgroundColor: GENERAL_COLOR}}>
        <Text style={{marginTop: 17, color: BACKGROUND_LIGHT}}>Favorites </Text>
      </Header>
      <RenderCards data={userData} refreshing={refresh} onRefresh={() => setRefresh(true)}/>
    </Container>
  );
}