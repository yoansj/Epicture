import React from "react";
import { View, Text ,StyleSheet} from "react-native";
import { Container, Card, Icon, Header, Left, Right, Button} from 'native-base';


export default function FavoritesPage() {
  return (
    <Container style={styles.myBlack}>
      <Header rounded androidStatusBarColor='black' style={styles.myGreen}>
        <Text style={{marginTop: 17, color:'rgb(18,18,18)'}}>Favorites </Text>
      </Header>
      <Card style={styles.myWarning}>
        <Text>Log In please </Text>
      </Card>
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