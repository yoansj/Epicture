import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import {Picker} from '@react-native-community/picker';
import { TextInput } from 'react-native';

export default function SearchPage() {
  return (
    <View>
      <View style={styles.myTop}>


      <TextInput style={styles.myBar}/>

          <Picker selectedValue={"Most Scoring"}
          style={styles.scrolLeft} >
            <Picker.Item label="Most Scoring" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>

          <Picker selectedValue={"Random"}
          style={styles.scrolLeft} >
            <Picker.Item label="Random" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
      </View>


      <Text>print les images</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  myTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor: "#566573",
    width: "100%",
    height: "45%"
  },
  scrolLeft: {
    textAlign: "center",
    height: 20,
    width: 175,
  },
  myBar: {
    marginLeft: 80,
    marginTop: 60,
    width: 200,
    height: 40,
    borderColor: 'black',
    backgroundColor: "#808B96",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderWidth: 1 , alignSelf: "center"
  },
});