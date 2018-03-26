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
  Alert,
  Modal,
  TouchableHighlight,

} from 'react-native';

import CustomDataModal from './src/components/CustomDataModal'

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
export default class App extends Component {
  componentDidMount() {
    const configuration = new ApptentiveConfiguration(
      credentials.apptentiveKey,
      credentials.apptentiveSignature
    );
    configuration.logLevel = 'verbose';
    Apptentive.register(configuration);
    Apptentive.onUnreadMessageChange = (count) => {
      console.log("Unread message count changed: " + count);
      this.setState({unreadMessageCount: count});
    };
  }

  constructor() {
    super()
    this.state = { eventName: '', mode: 'none', unreadMessageCount: 0 };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Unread messages: {this.state.unreadMessageCount}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={'Event Name'}
          value={this.state.eventName}
          onChangeText={(text) => this.setState({eventName: text})}
        />

        <Button
          style={styles.button}
          onPress={() => {
            Apptentive.engage(this.state.eventName);
          }}
          title="Engage"
        />

        <Button
          style={styles.button}
          onPress={() => {
            Apptentive.presentMessageCenter();
          }}
          title="Message Center"
        />

        <Button
          style={styles.button}
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

        <Button
          style={styles.button}
          onPress={() => {
            this._openCustomDataModal('device')
          }}
          title="Device Data"
        />

        <Button
          style={styles.button}
          onPress={() => {
            this._openCustomDataModal('person')
          }}
          title="Person Data"
        />

        { this._renderCustomDataModal(this.state.mode) }
      </View>
    );
  }

  _renderCustomDataModal(mode, closeHandler) {
    if (this.state.mode !== 'none') {
      return (
      <CustomDataModal
        mode={mode}
        closeHandler={() => { this._closeCustomDataModal() }}
      />)
    }
    return null
  }

  _openCustomDataModal(mode) {
    this.setState({mode: mode})
  }

  _closeCustomDataModal() {
    this.setState({mode: 'none'})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  },
  button: {
    width: 200,
    height: 40
  }
});
