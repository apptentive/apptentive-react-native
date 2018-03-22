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
   this.state = { eventName: '', dataModalVisible: false, dataModalMode: null, customDataKey: null };
 }

  setModalVisible(visible, mode) {
     this.setState({dataModalVisible: visible, dataModalMode: mode});
  }

  render() {
    return (
      <View style={styles.container}>
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
            this.setModalVisible(true, 'device')
          }}
          title="Device Data"
        />

        <Button
          onPress={() => {
            this.setModalVisible(true, 'person')
          }}
          title="Person Data"
        />

        <CustomDataModal
        mode: 'device',
        handler: visibiltyHandler
        />

      </View>
    );
  }
}


export default class CustomDataModel extends Component<Props> {

  constructor(props) {
   super(props);
   this.state = { customDataKey: null, customDataString: null };
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.dataModalVisible}
        />
        <View
        style={{marginTop: 22}}
        >
        <Button
          onPress={() => {
            this.props.closeHandler()
          }}
          title="Done"
        />
        <View style={styles.container}>
          <View
            style={{flex: 1, flexDirection: 'column'}}>
            <TextInput
              style={styles.fullBorderedTextInput}
              placeholder={'Custom Data Key'}
              value={this.state.customDataKey}
              onChangeText={(text) => this.setState({customDataKey: text})}
            />
            <Button
              onPress={() => {
                  if (this.state.dataModalMode == 'person') {
                    Apptentive.removeCustomPersonData(this.state.customDataKey)
                  } else if (this.state.dataModalMode == 'device') {
                    Apptentive.removeCustomDeviceData(this.state.customDataKey)
                  }
                }
              }
              title="Remove Custom Value"
            />
            <View
            style={styles.textInputButtonRow}>
            <TextInput
              style={styles.narrowBorderedTextInput}
              placeholder={'Custom Data String'}
              value={this.state.customDataString}
              onChangeText={(text) => this.setState({customDataString: text})}
            />
            <Button onPress={() => {
              if (this.state.dataModalMode == 'person') {
                Apptentive.addCustomPersonData(this.state.customDataKey, this.state.customDataString)
              } else if (this.state.dataModalMode == 'device') {
                Apptentive.addCustomDeviceData(this.state.customDataKey, this.state.customDataString)
              }
            }}
            title="Add"/>
            </View>
        </View>
        </View>
        </View>
      </Modal>
    );
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
