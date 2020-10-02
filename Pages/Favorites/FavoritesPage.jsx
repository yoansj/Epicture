import React from "react";
import { View, Text ,StyleSheet} from "react-native";
import { Container, Card, Icon, Header, Left, Right, Button} from 'native-base';


export default function FavoritesPage() {
  return (
    <Container>
      <Header rounded>
        <Text style={{marginTop: 17}}>Favorites </Text>
      </Header>
      <Card style={styles.myWarning}>
        <Text>Log In please </Text>
      </Card>
      <Container style={styles.myMiddle}>
        <Icon name="flask" />
        <Text>Wow !</Text>
        <Text>There is some space here</Text>
      </Container>
    </Container>
  );
}
const styles = StyleSheet.create({
  myMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  myWarning: {
    backgroundColor: 'red',
    alignItems: 'center',
    height: 60,
    justifyContent: "center"
  }
});