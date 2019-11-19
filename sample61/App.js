/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/no-set-state */
/* eslint-disable react-native/no-color-literals */
/**
* Apptentive React Native Sample
* https://github.com/apptentive/apptentive-react-native
*/

import React from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';
import CustomDataModal from './src/components/CustomDataModal';
import AuthModal from './src/components/AuthModal';
import showAlert from './src/helpers';

// From https://be.apptentive.com/apps/:id/settings/api
const credentials = Platform.select({
  ios: {
    apptentiveKey: process.env.IOS_APPTENTIVE_KEY || '',
    apptentiveSignature: process.env.IOS_APPTENTIVE_SIGNATURE || '',
  },
  android: {
    apptentiveKey: process.env.ANDROID_APPTENTIVE_KEY || '',
    apptentiveSignature: process.env.ANDROID_APPTENTIVE_SIGNATURE || '',
  },
});

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 200,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    width: 300,
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      eventName: '',
      mode: 'none',
      unreadMessageCount: 0,
      authModalVisible: false,
    };

    this.openCustomDataModal = this.openCustomDataModal.bind(this);
    this.closeCustomDataModal = this.closeCustomDataModal.bind(this);
    this.handleOpenAuthModal = this.handleOpenAuthModal.bind(this);
    this.closeAuthModal = this.closeAuthModal.bind(this);

    this.handleEngage = this.handleEngage.bind(this);
    this.handleShowMessageCenter = this.handleShowMessageCenter.bind(this);
    this.handleShowInteraction = this.handleShowInteraction.bind(this);

    this.renderCustomDataModal = this.renderCustomDataModal.bind(this);
    this.renderAuthModal = this.renderAuthModal.bind(this);
  }

  componentDidMount() {
    if (!credentials.apptentiveKey) {
      showAlert('Error', 'Please, provide Apptentive Key');
      return;
    }

    if (!credentials.apptentiveSignature) {
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
    // configuration.shouldEncryptStorage = true; // TODO: uncomment this line to enable encrypted storage

    // Register Apptentive
    Apptentive.register(configuration).then(() => {
      Apptentive.onUnreadMessageCountChanged = (count) => {
        this.setState({ unreadMessageCount: count });
      };
      Apptentive.onAuthenticationFailed = (reason) => {
        showAlert('Error', `Authentication failed:\n${reason}`);
      };
    }).catch((error) => {
      showAlert('Error', `Can't register Apptentive:\n${error.message}`);
    });
  }

  openCustomDataModal(mode) {
    this.setState({ mode });
  }

  closeCustomDataModal() {
    this.setState({ mode: 'none' });
  }

  handleOpenAuthModal() {
    this.setState({ authModalVisible: true });
  }

  closeAuthModal() {
    this.setState({ authModalVisible: false });
  }

  handleEngage() {
    const { eventName } = this.state;
    Apptentive.engage(eventName).then((engaged) => {
      if (!engaged) {
        showAlert('Interaction', `Interaction "${eventName}" was not engaged`);
      }
    }).catch((error) => {
      showAlert('Interaction', `Error while engaging interaction:\n\n${error.message}`);
    });
  }

  handleShowMessageCenter() {
    Apptentive.presentMessageCenter().then((presented) => {
      if (!presented) {
        showAlert('Message Center', 'Message Center was not presented');
      }
    }).catch((error) => {
      showAlert('Message Center', `Error while presenting Message Center:\n\n${error.message}`);
    });
  }

  handleShowInteraction() {
    const { eventName } = this.state;
    Apptentive.canShowInteraction(eventName).then((canShow) => {
      showAlert('Interaction', `Can Show Interaction for Event "${eventName}": ${canShow}`);
    }).catch((error) => {
      showAlert('Interaction', `Error while checking interaction:\n\n${error.message}`);
    });
  }

  renderCustomDataModal(newMode) {
    const { mode } = this.state;
    if (mode !== 'none') {
      return (
        <CustomDataModal
          accessibilityLabel="custom-data-modal"
          closeHandler={this.closeCustomDataModal}
          mode={newMode}
          testID="custom-data-modal"
        />
      );
    }
    return null;
  }

  renderAuthModal() {
    const { authModalVisible } = this.state;
    if (authModalVisible) {
      return (
        <AuthModal
          accessibilityLabel="auth-modal"
          closeHandler={this.closeAuthModal}
          testID="auth-modal"
        />
      );
    }
    return null;
  }

  render() {
    const { eventName, mode, unreadMessageCount } = this.state;
    const unreadMessages = `Unread messages: ${unreadMessageCount}`;
    return (
      <View accessibilityLabel="app-root" style={styles.container} testID="app-root">
        <Text accessibilityLabel="unread-messages" testID="unread-messages">
          {unreadMessages}
        </Text>
        <TextInput
          accessibilityLabel="input-event-name"
          onChangeText={text => this.setState({ eventName: text })}
          placeholder="Event Name"
          style={styles.textInput}
          testID="input-event-name"
          value={eventName}
        />
        <Button
          accessibilityLabel="button-engage"
          onPress={this.handleEngage}
          style={styles.button}
          testID="button-engage"
          title="Engage"
        />
        <Button
          accessibilityLabel="button-message-center"
          onPress={this.handleShowMessageCenter}
          style={styles.button}
          testID="button-message-center"
          title="Message Center"
        />
        <Button
          accessibilityLabel="button-can-show-interaction"
          onPress={this.handleShowInteraction}
          style={styles.button}
          testID="button-can-show-interaction"
          title="Can Show Interaction?"
        />
        <Button
          accessibilityLabel="button-device-data"
          onPress={() => {
            this.openCustomDataModal('device');
          }}
          style={styles.button}
          testID="button-device-data"
          title="Device Data"
        />
        <Button
          accessibilityLabel="button-person-data"
          onPress={() => {
            this.openCustomDataModal('person');
          }}
          style={styles.button}
          testID="button-person-data"
          title="Person Data"
        />
        <Button
          accessibilityLabel="button-authentication"
          onPress={this.handleOpenAuthModal}
          testID="button-authentication"
          title="Authentication"
        />
        {this.renderCustomDataModal(mode)}
        {this.renderAuthModal()}
      </View>
    );
  }
}

export default App;
