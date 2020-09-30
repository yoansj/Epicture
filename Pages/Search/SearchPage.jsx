import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Container } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

export default function SearchPage() {
  return (
    <View>
      <Text>Card displayer</Text>
    </View>
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