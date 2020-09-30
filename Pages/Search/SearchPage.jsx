import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Container } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

export default function SearchPage() {
  return (
    <Container style={{backgroundColor: "grey", height: "10%", textAlign: 'center'}}>
      <Text><br/>bar de recherche<br/></Text>
      <Button title="Most viral"></Button>
      <Button title="User submitted"></Button>
      <Button title="Hightest Scoring"></Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});