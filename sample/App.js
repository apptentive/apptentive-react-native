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
  Button,
  TextInput,
  Alert
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

  constructor(props) {
   super(props);
   this.state = { eventName: '' };
 }


  render() {
    return (
      <View style={styles.container}>
      <TextInput
      style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1}}
      placeholder={'Event Name'}
      value={this.state.eventName}
      onChangeText={(text) => this.setState({eventName: text})}
      />
      <Button
      onPress={() => {
        Apptentive.engage(this.state.eventName);
      }}
      title="Engage"
      />
      <Button
      onPress={() => {
        Apptentive.presentMessageCenter();
      }}
      title="Message Center"
      />
      <Button
      onPress={() => {
        Apptentive.canShowInteraction(this.state.eventName).then(canShow => {
          Alert.alert(
            'Can Show Interaction for Event “' + this.state.eventName + '”',
            '' + canShow + '',
            [
              {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        })
      }}
      title="Can Show Interaction?"
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
