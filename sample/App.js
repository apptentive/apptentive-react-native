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

import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';

const credentials = Platform.select({
  ios: {
    apptentiveKey: 'IOS-REACT-NATIVE-IOS',
    apptentiveSignature: 'a5bef0098ee104b00b58376a2631164a',
    jwtSigning: 'f4347328dccc33599bb5fbe8adcdbe88'
  },
  android: {
    apptentiveKey: 'ANDROID-REACT-NATIVE-ANDROID',
    apptentiveSignature: 'd64a65f7232fe25d67b65b91b7e974fc',
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
   this.state = { eventName: '', dataModalVisible: false, dataModalMode: 'device' };
 }

  setModalVisible(visible) {
     this.setState({dataModalVisible: visible});
  }

  setModalMode(mode) {
    this.setState({dataModalMode: mode});
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

        <Button
          onPress={() => {
            this.setModalVisible(true)
          }}
          title="Device Data"
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.dataModalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.container}>
            <View>
              <TextInput
                style={{height: 40, width: 300, borderColor: 'gray', borderWidth: 1}}
                placeholder={'Custom Data Key'}
                value={this.state.eventName}
                onChangeText={(text) => this.setState({eventName: text})}
              />
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.dataModalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
