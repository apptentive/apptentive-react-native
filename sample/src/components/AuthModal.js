import React, { Component } from 'react';
import { View, Text, Modal, Button, TextInput, Picker, Platform, DatePickerIOS, DatePickerAndroid, Alert } from 'react-native';
import { Apptentive } from 'apptentive-react-native';
import JWT from 'react-native-jwt-io';

const DatePicker = Platform.select({
  ios: () => require('DatePickerIOS'),
  android: () => require('DatePickerAndroid'),
})();

export default class CustomDataModal extends Component {
  constructor() {
    super()
    let threeDaysHence = new Date();
    threeDaysHence.setDate(threeDaysHence.getDate() + 3);

    this.state = { sub: "Frank", expiry: threeDaysHence, isLoggedIn: false }
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
          <Text>Sub:</Text>
          <Picker
            selectedValue={this.state.sub}
            onValueChange={(itemValue, itemIndex) => this.setState({sub: itemValue})}>
            <Picker.Item label="Alex" value="Alex" />
            <Picker.Item label="Frank" value="Frank" />
            <Picker.Item label="Sky" value="Sky" />
          </Picker>
          <Text>Expiry:</Text>
          <DatePicker
            date={this.state.expiry}
            onDateChange={(date) => { this.setState({expiry: date})}}
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
      this.props.closeHandler();
    } else {
      let now = new Date();
      //let jwt = JWT.encode({ sub: this.state.sub, iat: Math.floor(now.getTime() / 1000), exp: Math.floor(this.state.expiry.getTime() / 1000), iss: "ClientTeam" }, this.props.jwtSigning, 'HS512');
      let jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1MjI0MzE2NTIsImlzcyI6IkNsaWVudFRlYW0iLCJzdWIiOiJGcmFuayIsImlhdCI6MTUyMjE3MjQ1NX0.LME2JHmw1wQvLlZPmQJo-gNxklqoyfxdXG8dtn8yN9vwAAmER7PVPENowbMHuvd7cvF9YHdVdIFDyHGPMFANTA";
      Apptentive.logIn(jwt).then(() => {
        this.setState({isLoggedIn: true});
        this.props.closeHandler()
      }).catch((errorMessage) => {
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

    this.setState({isLoggedIn: true})
  }
}

styles = {
  container: {
    marginTop: 22,
    flex: 1,
    flexDirection: 'column',
  },
  textInputButtonRow: {
    flex: 1,
    flexDirection: 'row'
  },
  borderedTextInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  }
}
