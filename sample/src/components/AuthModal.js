import React, { Component } from 'react';
import { View, Text, Modal, Button, TextInput, Alert } from 'react-native';
import { Apptentive } from 'apptentive-react-native';
import JWT from 'react-native-jwt-io';

export default class CustomDataModal extends Component {
  constructor() {
    super()
    this.state = { isLoggedIn: false, JWT: '' }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={() => { this.props.closeHandler() }}
        >
        <View style={styles.container} >
          <Button title={this._getLoginButtonLabel()} onPress={() => {
              this._toggleLogin()
            }}
          />
          <TextInput
            style={styles.borderedTextInput}
            placeholder={'JWT'}
            value={this.state.JWT}
            onChangeText={(text) => this.setState({JWT: text})}
          />
        </View>
    </Modal>);
  }

  _getLoginButtonLabel() {
    if (this.state.isLoggedIn) {
      return "Log Out";
    } else {
      return "Log In";
    }
  }

  _toggleLogin() {
    if (this.state.isLoggedIn) {
      Apptentive.logOut();
      this.setState({isLoggedIn: false})
      this.props.closeHandler();
    } else {
      Apptentive.logIn(this.state.JWT)
        .then(() => {
          this.setState({isLoggedIn: true});
          this.props.closeHandler()
        })
        .catch((errorMessage) => {
          Alert.alert(
            'Login Failed',
            errorMessage.message,
            [
              {text: 'OK', onPress: () => this.props.closeHandler(), style: 'cancel'},
            ],
            { cancelable: false }
          )
        });
    }
  }
}

styles = {
  container: {
    marginTop: 22,
    flex: 1,
    flexDirection: 'column',
  },
  borderedTextInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  }
}
