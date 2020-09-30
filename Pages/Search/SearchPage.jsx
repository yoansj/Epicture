import React from "react";
import { View, Text } from "react-native";
import { Container } from "@material-ui/core";

export default function SearchPage() {
  return (
    <Container style={{backgroundColor: "grey", height: "10%", textAlign: 'center'}}>
      <Text><br/>bar de recherche<br/></Text>
      <button>Most viral</button>
      <button>User submitted</button>
      <button>Hightest Scoring</button>
    </Container>
  );
}
