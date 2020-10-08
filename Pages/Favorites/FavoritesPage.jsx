import React, {useState, useEffect} from "react";
import { View, Text ,StyleSheet} from "react-native";
import { getUserData} from "../Authentification/AuthPage";
import {imgurGetAlbumFav, imgurGetImageId} from "../../imgur.js"
import { Container, Card, Icon, Header, Left, Right, Button} from 'native-base';
import { renderCards } from "../Search/CardDisplayer";


//iterate function data
function iterateData(data) {
  for (let i = 0; i < data.lenght; i++) {
    data[i].images = getImage(data[i].id);
  }
  return (data);
}

export default function FavoritesPage() {

  const [userData, setUserData] = useState("EMPTY");
  const [userFav, setUserFav] = useState(null);

  useEffect(() => {
    getUserData().then((value) => {
      setUserData(value);
      imgurGetAlbumFav(value.acess_token, value.username).then((value) => {
       // setUserFav(value.data)
        let data = value;
      }
      );
    });
  }, []);

  return (
    <Container style={styles.myBlack}>
      <Header rounded androidStatusBarColor='black' style={{backgroundColor: 'black'}}>
        <Text style={{marginTop: 17, color: 'rgb(27,183,110)'}}>Favorites </Text>
      </Header>

      {renderCards(userFav)}


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