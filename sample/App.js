/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';

const credentials = Platform.select({
  ios: {
    apptentiveKey: '___YOUR_IOS_APPTENTIVE_KEY___',
    apptentiveSignature: '___YOUR_IOS_APPTENTIVE_SIGNATURE___',
    jwtSigning: 'f4347328dccc33599bb5fbe8adcdbe88'
  },
  android: {
    apptentiveKey: '___YOUR_ANDROID_APPTENTIVE_KEY___',
    apptentiveSignature: '___YOUR_ANDROID_APPTENTIVE_SIGNATURE___c',
    jwtSigning: 'dd4cf3d158e2ad5bc285733ef191d235'
  }
});

type Props = {};
export default class App extends Component<Props> {
  componentDidMount() {
    const configuration = new ApptentiveConfiguration(
      credentials.apptentiveKey,
      credentials.apptentiveSignature
    );
    configuration.logLevel = 'verbose';
    Apptentive.register(configuration);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>TODO: implement me</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
