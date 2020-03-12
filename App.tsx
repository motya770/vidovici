import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';

const model = await mobilenet.load();

const image = require('./assets/images/catsmall.jpg');
const imageAssetPath = Image.resolveAssetSource(image);
const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
const imageData = await response.arrayBuffer();

const imageTensor = decodeJpeg(imageData);

const prediction = await model.classify(imageTensor);

console.log(prediction);
// Use prediction in app.
setState({
  prediction,
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app 234!</Text>
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
});
