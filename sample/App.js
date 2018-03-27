/**
* Apptentive React Native Sample
* https://github.com/apptentive/apptentive-react-native
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
import AuthModal from './src/components/AuthModal'

import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';

const credentials = Platform.select({
  ios: {
    apptentiveKey: 'IOS-REACT-NATIVE-IOS',
    apptentiveSignature: 'a5bef0098ee104b00b58376a2631164a'
  },
  android: {
    apptentiveKey: 'ANDROID-REACT-NATIVE-ANDROID',
    apptentiveSignature: 'd64a65f7232fe25d67b65b91b7e974fc'
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
    this.state = { eventName: '', mode: 'none', unreadMessageCount: 0, authModalVisible: false };
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

        <Button
          onPress={() => {
            this._openAuthModal()
          }}
          title="Authentication"
        />

        { this._renderCustomDataModal(this.state.mode) }
        { this._renderAuthModal() }

      </View>
    );
  }

  _renderCustomDataModal(mode) {
    if (this.state.mode !== 'none') {
      return (
      <CustomDataModal
        mode={mode}
        closeHandler={() => { this._closeCustomDataModal() }}
      />)
    }
    return null
  }

  _renderAuthModal() {
    if (this.state.authModalVisible) {
      return (
      <AuthModal
        closeHandler={() => { this._closeAuthModal() }}
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

  _openAuthModal() {
    this.setState({authModalVisible: true})
  }

  _closeAuthModal() {
    this.setState({authModalVisible: false})
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
