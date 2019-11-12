/* eslint-disable react/jsx-max-depth */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-set-state */
import React from 'react';
import { View, Modal, Button, TextInput } from 'react-native';
import { Apptentive } from 'apptentive-react-native';
import showAlert from '../helpers';

const styles = {
  container: {
    marginTop: 22,
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    width: 300,
    height: 40,
    flexDirection: 'row',
  },
  borderedTextInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
  },
};

export default class CustomDataModal extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      JWT: '',
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    const { closeHandler } = this.props;
    const { JWT } = this.state;
    Apptentive.logIn(JWT).then(() => {
      this.setState({ isLoggedIn: true });
      showAlert('Login', 'Success!', closeHandler);
    }).catch((errorMessage) => {
      showAlert('Login Failed', errorMessage.message, closeHandler);
    });
  }

  handleLogout() {
    const { closeHandler } = this.props;
    Apptentive.logOut().then(() => {
      this.setState({ isLoggedIn: true });
      showAlert('Logout', 'Success!', closeHandler);
    }).catch((errorMessage) => {
      showAlert('Logout failed', errorMessage.message, closeHandler);
    });

    this.setState({ isLoggedIn: false });
  }

  render() {
    const { closeHandler } = this.props;
    const { JWT } = this.state;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Modal
        accessibilityLabel="auth-modal"
        animationType="slide"
        onRequestClose={closeHandler}
        testID="auth-modal"
        transparent={false}
      >
        <View
          accessibilityLabel="auth-modal-view"
          style={styles.container}
          testID="auth-modal-view"
        >
          <TextInput
            accessibilityLabel="text-input-jwt"
            onChangeText={text => this.setState({ JWT: text })}
            placeholder="JWT"
            style={styles.borderedTextInput}
            testID="text-input-jwt"
            value={JWT}
          />
          <View
            accessibilityLabel="view-button-container"
            style={styles.buttonContainer}
            testID="button-container"
          >
            <Button
              accessibilityLabel="button-login"
              onPress={this.handleLogin}
              testID="button-login"
              title="Login"
            />
            <Button
              accessibilityLabel="button-logout"
              onPress={this.handleLogout}
              testID="button-logout"
              title="Logout"
            />
          </View>
        </View>
      </Modal>);
  }
}
