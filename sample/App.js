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
  Modal
} from 'react-native';

import CustomDataModal from './src/components/CustomDataModal';
import AuthModal from './src/components/AuthModal';

import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';
import { showAlert } from './src/helpers';

const credentials = Platform.select({
  ios: {
    apptentiveKey: '<YOUR_IOS_APPTENTIVE_KEY>',
    apptentiveSignature: '<YOUR_IOS_APPTENTIVE_SIGNATURE>',
  },
  android: {
    apptentiveKey: '<YOUR_ANDROID_APPTENTIVE_KEY>',
    apptentiveSignature: '<YOUR_ANDROID_APPTENTIVE_SIGNATURE>',
    // shouldEncryptStorage: true,
  },
});

export default class App extends Component {
  constructor() {
    super();
    this.state = { eventName: '', mode: 'none', unreadMessageCount: 0, authModalVisible: false };
  }

  componentDidMount() {
    if (credentials.apptentiveKey === '<YOUR_IOS_APPTENTIVE_KEY>' ||
        credentials.apptentiveKey === '<YOUR_ANDROID_APPTENTIVE_KEY>') {
      showAlert('Error', 'Please, provide Apptentive Key');
      return;
    }

    if (credentials.apptentiveSignature === '<YOUR_IOS_APPTENTIVE_SIGNATURE>' ||
        credentials.apptentiveSignature === '<YOUR_ANDROID_APPTENTIVE_SIGNATURE>') {
      showAlert('Error', 'Please, provide Apptentive Signature');
      return;
    }

    // Create configuration
    const configuration = new ApptentiveConfiguration(
      credentials.apptentiveKey,
      credentials.apptentiveSignature
    );

    // Override log level (optional)
    configuration.logLevel = 'verbose';
    configuration.shouldSanitizeLogMessages = false;

    // Register Apptentive
    Apptentive.register(configuration)
      .then(() => {
        Apptentive.onUnreadMessageCountChanged = (count) => {
          this.setState({ unreadMessageCount: count });
        };
        Apptentive.onAuthenticationFailed = (reason) => {
          showAlert('Error', `Authentication failed:\n${reason}`);
        };
      })
      .catch((error) => {
        showAlert('Error', `Can't register Apptentive:\n${error.message}`);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
Unread messages:
          {this.state.unreadMessageCount}
        </Text>
        <TextInput
          onChangeText={text => this.setState({ eventName: text })}
          placeholder="Event Name"
          style={styles.textInput}
          value={this.state.eventName}
        />

        <Button
          onPress={() => {
            Apptentive.engage(this.state.eventName)
              .then((engaged) => {
                if (!engaged) {
                  showAlert('Interaction', `Interaction "${this.state.eventName}" was not engaged`);
                }
              })
              .catch((error) => {
                showAlert('Interaction', `Error while engaging interaction:\n\n${error.message}`);
              });
          }}
          style={styles.button}
          title="Engage"
        />

        <Button
          onPress={() => {
            Apptentive.presentMessageCenter()
              .then((presented) => {
                if (!presented) {
                  showAlert('Message Center', 'Message Center was not presented');
                }
              })
              .catch((error) => {
                showAlert('Message Center', `Error while presenting Message Center:\n\n${error.message}`);
              });
          }}
          style={styles.button}
          title="Message Center"
        />

        <Button
          onPress={() => {
            Apptentive.canShowInteraction(this.state.eventName)
              .then((canShow) => {
                showAlert('Interaction', `Can Show Interaction for Event "${this.state.eventName}": ${canShow}`);
              })
              .catch((error) => {
                showAlert('Interaction', `Error while checking interaction:\n\n${error.message}`);
              });
          }}
          style={styles.button}
          title="Can Show Interaction?"
        />

        <Button
          onPress={() => {
            this._openCustomDataModal('device');
          }}
          style={styles.button}
          title="Device Data"
        />

        <Button
          onPress={() => {
            this._openCustomDataModal('person');
          }}
          style={styles.button}
          title="Person Data"
        />

        <Button
          onPress={() => {
            this._openAuthModal();
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
          closeHandler={() => { this._closeCustomDataModal(); }}
          mode={mode}
        />);
    }
    return null;
  }

  _renderAuthModal() {
    if (this.state.authModalVisible) {
      return (
        <AuthModal
          closeHandler={() => { this._closeAuthModal(); }}
        />);
    }
    return null;
  }

  _openCustomDataModal(mode) {
    this.setState({ mode });
  }

  _closeCustomDataModal() {
    this.setState({ mode: 'none' });
  }

  _openAuthModal() {
    this.setState({ authModalVisible: true });
  }

  _closeAuthModal() {
    this.setState({ authModalVisible: false });
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
    borderWidth: 1,
  },
  button: {
    width: 200,
    height: 40,
  },
});
