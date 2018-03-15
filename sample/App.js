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
  View,
  Button
} from 'react-native';

import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';

const credentials = Platform.select({
  ios: {
    apptentiveKey: 'IOS-REACT-NATIVE-IOS',
    apptentiveSignature: 'a5bef0098ee104b00b58376a2631164a',
    jwtSigning: 'f4347328dccc33599bb5fbe8adcdbe88'
  },
  android: {
    apptentiveKey: 'ANDROID-REACT-NATIVE-ANDROID',
    apptentiveSignature: 'd64a65f7232fe25d67b65b91b7e974fc',
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
        <Button
          onPress={() => {
            Apptentive.presentMessageCenter();
          }}
          title="Message Center"
        />
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
