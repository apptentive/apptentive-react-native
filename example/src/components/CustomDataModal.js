/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-max-depth */
/* eslint-disable react/no-set-state */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/require-optimization */
import React from 'react';
import { View, Modal, Button, TextInput, Picker } from 'react-native';
import { Apptentive } from 'apptentive-react-native';

const styles = {
  container: {
    flex: 1,
    marginTop: 22,
    flexDirection: 'column',
  },
  dataContainer: {
    flexDirection: 'column',
    height: 80,
  },
  textInputButtonRow: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
  },
  borderedTextInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
  },
  button: {
  },
};

export default class CustomDataModal extends React.Component {
  static getTypedValue(value, type) {
    switch (type) {
      case 'number':
        return Number.parseFloat(value);
      case 'boolean':
        return value === 'true';
      default:
        return value;
    }
  }

  constructor() {
    super();
    this.state = {
      key: '',
      value: '',
      type: 'string',
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleAdd() {
    const { mode } = this.props;
    const { key, type, value } = this.state;
    if (mode === 'person') {
      Apptentive.addCustomPersonData(key, CustomDataModal.getTypedValue(value, type));
    } else if (mode === 'device') {
      Apptentive.addCustomDeviceData(key, CustomDataModal.getTypedValue(value, type));
    }
  }

  handleRemove() {
    const { mode } = this.props;
    const { key } = this.state;
    if (mode === 'person') {
      Apptentive.removeCustomPersonData(key);
    } else if (mode === 'device') {
      Apptentive.removeCustomDeviceData(key);
    }
  }

  render() {
    const { closeHandler } = this.props;
    const { key, type, value } = this.state;
    const placeholder = `Custom data ${type}`;
    return (
      <Modal
        accessibilityLabel="custom-data-modal"
        animationType="slide"
        onRequestClose={closeHandler}
        testID="custom-data-modal"
        transparent={false}
      >
        <View
          accessibilityLabel="custom-data-view"
          style={styles.container}
          testID="custom-data-view"
        >
          <Button
            accessibilityLabel="button-done"
            onPress={closeHandler}
            testID="button-done"
            title="Done"
          />
          <Picker
            accessibilityLabel="picker-type"
            onValueChange={itemValue => this.setState({ type: itemValue })}
            selectedValue={type}
            testID="picker-type"
          >
            <Picker.Item label="String" value="string" />
            <Picker.Item label="Boolean" value="boolean" />
            <Picker.Item label="Number" value="number" />
          </Picker>
          <View
            accessibilityLabel="view-button-rows"
            style={styles.dataContainer}
            testID="view-button-rows"
          >
            <View
              accessibilityLabel="view-button-row-add"
              style={styles.textInputButtonRow}
              testID="view-button-row-add"
            >
              <TextInput
                accessibilityLabel="text-input-key"
                onChangeText={text => this.setState({ key: text })}
                placeholder="Custom data key"
                style={styles.borderedTextInput}
                testID="text-input-key"
                value={key}
              />
              <Button
                accessibilityLabel="button-remove"
                onPress={this.handleRemove}
                style={styles.button}
                testID="button-remove"
                title="Remove"
              />
            </View>
            <View
              accessibilityLabel="view-button-row-remove"
              style={styles.textInputButtonRow}
              testID="view-button-row-remove"
            >
              <TextInput
                accessibilityLabel="text-input-value"
                onChangeText={text => this.setState({ value: text })}
                placeholder={placeholder}
                style={styles.borderedTextInput}
                testID="text-input-value"
                value={value}
              />
              <Button
                accessibilityLabel="button-add"
                onPress={this.handleAdd}
                style={styles.button}
                testID="button-add"
                title="Add"
              />
            </View>
          </View>
        </View>
      </Modal>);
  }
}
