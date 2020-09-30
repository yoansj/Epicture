import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

export default function SearchPage() {
  return (
    <View>
      <Text>Card displayer</Text>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Text>xs=12</Text>
        </Grid>
      </Grid>

    </View>
  );
}

const styles = StyleSheet.create({
  myTop: {
    backgroundColor: "grey",
    width: "100%",
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