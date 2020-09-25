import React from 'react';
import { StyleSheet, View} from 'react-native';
import Search from './Search.js';

export default function App() {

  return (
    <View style={styles.container}>
      <Search />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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

/*
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        title="Yes" 
        onPress={() => {gallery();}} 
      />
      <Button
        title="Search" 
        onPress={() => {setPressed(true)}} 
      />
      <Text>{test !== "" && test.data[0].link}</Text>
      <Image style={styles.image} source={{uri: test !== "" && test.data[0].images[0].link}} />
      <Image source={{uri: "https://imgur.com/a/sMfA6yg"}} />
      <Image
        style={styles.tinyLogo}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />

*/