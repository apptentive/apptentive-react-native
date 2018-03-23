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
import AuthModal from './src/components/AuthModal'

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
    this.state = { eventName: '', mode: 'none', unreadMessageCount: 0, authModalVisible: false };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Unread messages: {this.state.unreadMessageCount}</Text>
        <TextInput
          style={styles.fullBorderedTextInput}
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

        <Button
          onPress={() => {
            this._openCustomDataModal('device')
          }}
          title="Device Data"
        />

        <Button
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
        jwtSigning={credentials.jwtSigning}
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
  textInputButtonRow: {
    flexDirection: 'row'
  },
  narrowBorderedTextInput: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  },
  fullBorderedTextInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  }
});
