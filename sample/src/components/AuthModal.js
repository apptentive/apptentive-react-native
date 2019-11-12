import React, { Component } from 'react';
import { View, Text, Modal, Button, TextInput } from 'react-native';
import { Apptentive } from 'apptentive-react-native';
import { showAlert } from '../helpers'

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
          <TextInput
            style={styles.borderedTextInput}
            placeholder={'JWT'}
            value={this.state.JWT}
            onChangeText={(text) => this.setState({JWT: text})}
          />
          <View style={styles.buttonContainer}>
            <Button title='Login' onPress={() => {
                this._login()
              }}
            />
            <Button title='Logout' onPress={() => {
                this._logout()
              }}
            />
          </View>
        </View>
    </Modal>);
  }

  _login() {
    Apptentive.logIn(this.state.JWT)
      .then(() => {
        this.setState({isLoggedIn: true});
        showAlert("Login", "Success!", this.props.closeHandler)
      })
      .catch((errorMessage) => {
        showAlert("Login Failed", errorMessage.message, this.props.closeHandler)
      });
  }

  _logout() {
    Apptentive.logOut()
      .then(() => {
        this.setState({isLoggedIn: true});
        showAlert("Logout", "Success!", this.props.closeHandler)
      })
      .catch((errorMessage) => {
        showAlert("Logout failed", errorMessage.message, this.props.closeHandler)
      });

    this.setState({isLoggedIn: false})
  }
}

styles = {
  container: {
    marginTop: 22,
    flex: 1,
    flexDirection: 'column',
  },
  buttonContainer: {
    width: 300,
    height: 40,
    flexDirection: 'row'
  },
  borderedTextInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  }
}
