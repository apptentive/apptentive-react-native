import React, { Component } from 'react';
import { View, Text, Modal, Button, TextInput, Picker } from 'react-native';
import { Apptentive } from 'apptentive-react-native';

export default class CustomDataModal extends Component {
  constructor() {
    super()
    this.state = { key: '', value: '', type: 'string'}
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={() => { this.props.closeHandler() }}
        >
        <View style={styles.container} >
          <Button title="Done" onPress={() => {
              this.props.closeHandler()
            }}
          />
          <Picker
            selectedValue={this.state.type}
            onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
            <Picker.Item label="String" value="string" />
            <Picker.Item label="Boolean" value="boolean" />
            <Picker.Item label="Number" value="number" />
          </Picker>
          <View style={styles.dataContainer}>
            <View style={styles.textInputButtonRow}>
              <TextInput
                style={styles.borderedTextInput}
                placeholder={'Custom data key'}
                value={this.state.key}
                onChangeText={(text) => this.setState({key: text})}
              />
              <Button
                style={styles.button}
                onPress={() => {
                  if (this.props.mode == 'person') {
                    Apptentive.removeCustomPersonData(this.state.key)
                  } else if (this.props.mode == 'device') {
                    Apptentive.removeCustomDeviceData(this.state.key)
                  }
                }
              }
              title="Remove"
            />
            </View>
            <View
              style={styles.textInputButtonRow}>
              <TextInput
                style={styles.borderedTextInput}
                placeholder={`Custom data ${this.state.type}`}
                value={this.state.value}
                onChangeText={(text) => this.setState({value: text})}
              />
              <Button
                style={styles.button}
                onPress={() => {
                  if (this.props.mode == 'person') {
                    const value = this._getTypedValue(this.state.value, this.state.type)
                    Apptentive.addCustomPersonData(this.state.key, value)
                  } else if (this.props.mode == 'device') {
                    const value = this._getTypedValue(this.state.value, this.state.type)
                    Apptentive.addCustomDeviceData(this.state.key, value)
                  }
                }}
                title="Add"/>
            </View>
          </View>
        </View>
    </Modal>);
  }

  _getTypedValue(value, type) {
    switch (type) {
      case 'number':
        return Number.parseFloat(value)
      case 'boolean':
        return value == 'true'
      default:
        return value
    }
  }
}

styles = {
  container: {
    flex: 1,
    marginTop: 22,
    flexDirection: 'column'
  },
  dataContainer: {
    flexDirection: 'column',
    height: 80
  },
  textInputButtonRow: {
    flex: 1,
    flexDirection: 'row',
    height: 40
  },
  borderedTextInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    height: 40
  },
  button: {
  }
}
