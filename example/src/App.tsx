import * as React from 'react';

import { StyleSheet, Button, View, Text, TextInput, Platform } from 'react-native';
import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';

interface State {
  eventName: string;
}

// Set your Apptentive Dashbaord Credentials
const credentials = Platform.select({
  android: {
    apptentiveKey: "___YOUR_ANDROID_APPTENTIVE_KEY___",
    apptentiveSignature: "___YOUR_ANDROID_APPTENTIVE_SIGNATURE___",
  },
  ios: {
    apptentiveKey: "___YOUR_IOS_APPTENTIVE_KEY___",
    apptentiveSignature: "___YOUR_IOS_APPTENTIVE_SIGNATURE___",
  },
});

export class App extends React.Component<{}, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      eventName: "",
      personDataKey: "",
      personDataValue: "",
      personDataKeyToRemove: "",
      deviceDataKey: "",
      deviceDataValue: "",
      deviceDataKeyToRemove: "",
      personName: "",
      personEmail: "",
      testEventForInteraction: "",
    };
  }

  componentDidMount() {
    // Check for key and signature
    if (!credentials.apptentiveKey || credentials.apptentiveKey === "___YOUR_IOS_APPTENTIVE_KEY___" || credentials.apptentiveKey === "___YOUR_ANDROID_APPTENTIVE_KEY___") {
      console.log("APPTENTIVE ERROR: Please provide Apptentive Key");
      return;
    }
    if (!credentials.apptentiveSignature || credentials.apptentiveSignature === "___YOUR_IOS_APPTENTIVE_SIGNATURE___" || credentials.apptentiveSignature === "___YOUR_ANDROID_APPTENTIVE_SIGNATURE___") {
      console.log("APPTENTIVE ERROR: Please provide Apptentive Signature");
      return;
    }

    // Create Apptentive Configuration
    const configuration = new ApptentiveConfiguration(
      credentials.apptentiveKey,
      credentials.apptentiveSignature
    );
    // Set configuration log level
    configuration.logLevel = 'debug';
    configuration.shouldEncryptStorage = false;
    configuration.shouldSanitizeLogMessages = false;
    configuration.setTroubleshootingModeEnabled = true;

    Apptentive.onUnreadMessageCountChanged = args => {
      console.log("APPTENTIVE TEST: Unread message count changed to ", args.count)
    } 

    // Register Apptentive
    Apptentive.register(configuration);
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>

          {/* Test Events */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Where Event"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({eventName: newText}))}
            />
            <Button
              onPress={() => {
                Apptentive.engage(this.state.eventName)
              }}
              title="Engage"
            />
          </View>

          {/* Test Add Custom Person Data */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Person Data Key"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({personDataKey: newText}))}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Person Data Value"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({personDataValue: newText}))}
            />
            <Button
              onPress={() => {
                // Parse dataVal and then pass to Apptentive
                var dataVal = this.state.personDataValue
                // Number
                var customDataNum = Number(dataVal)
                if (Number.isNaN(customDataNum)) {
                    // Bool
                    var customDataBoolStr = dataVal.toLowerCase().trim()
                    if (customDataBoolStr == "true") {
                      Apptentive.addCustomPersonData(this.state.personDataKey, true)
                    } else if (customDataBoolStr == "false") {
                      Apptentive.addCustomPersonData(this.state.personDataKey, false)
                    } else {
                      // String
                      Apptentive.addCustomPersonData(this.state.personDataKey, dataVal)
                    }
                } else {
                  Apptentive.addCustomPersonData(this.state.personDataKey, customDataNum)
                }
              }}
              title="Add"
            />
          </View>

          {/* Test remove custom person data */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Remove Person Data"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({personDataKeyToRemove: newText}))}
            />
            <Button
              onPress={() => {
                Apptentive.removeCustomPersonData(this.state.personDataKeyToRemove)
              }}
              title="Remove"
            />
          </View>

          {/* Test Add Custom Device Data */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Device Data Key"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({deviceDataKey: newText}))}
            />
            <TextInput
              style={styles.textinput}
              placeholder="Device Data Value"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({deviceDataValue: newText}))}
            />
            <Button
              onPress={() => {
                // Parse dataVal and then pass to Apptentive
                var dataVal = this.state.personDataValue
                // Number
                var customDataNum = Number(dataVal)
                if (Number.isNaN(cdNum)) {
                    // Bool
                    var customDataBoolStr = dataVal.toLowerCase().trim()
                    if (customDataBoolStr == "true") {
                      Apptentive.addCustomDeviceData(this.state.deviceDataKey, true)
                    } else if (customDataBoolStr == "false") {
                      Apptentive.addCustomDeviceData(this.state.deviceDataKey, false)
                    } else {
                      // String
                      Apptentive.addCustomDeviceData(this.state.deviceDataKey, dataVal)
                    }
                } else {
                  Apptentive.addCustomDeviceData(this.state.deviceDataKey, customDataNum)
                }
              }}
              title="Add"
            />
          </View>

          {/*  Test remove custom device data */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Remove Device Data"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({deviceDataKeyToRemove: newText}))}
            />
            <Button
              onPress={() => {
                Apptentive.removeCustomDeviceData(this.state.deviceDataKeyToRemove)
              }}
              title="Remove"
            />
          </View>

          {/* Test set and get person name */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Person Name"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({personName: newText}))}
            />
            <Button
              onPress={() => {
                Apptentive.setPersonName(this.state.personName)
                Apptentive.getPersonName().then( (name) => {
                  console.log("APPTENTIVE TEST: Person Name is now: " + name)
                }).catch( (error) => {
                  console.log("APPTENTIVE TEST: Error getting Person Name: ", error)
                })
              }}
              title="Set"
            />
          </View>

          {/* Test set and get person email */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Person Email"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({personEmail: newText}))}
            />
            <Button
              onPress={() => {
                Apptentive.setPersonEmail(this.state.personEmail)
                Apptentive.getPersonEmail().then( (email) => {
                  console.log("APPTENTIVE TEST: Person Email is now: " + email)
                }).catch( (error) => {
                  console.log("APPTENTIVE TEST: Error getting Person Email: ", error)
                })
              }}
              title="Set"
            />
          </View>

          {/* Test can show interaction */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <TextInput
              style={styles.textinput}
              placeholder="Test Can Show Interaction"
              placeholderTextColor="dimgray"
              onChangeText={newText => this.setState(prevState => ({testEventForInteraction: newText}))}
            />
            <Button
              onPress={() => {
                Apptentive.canShowInteraction(this.state.testEventForInteraction).then( (canShowInteraction) => {
                  console.log("APPTENTIVE TEST: Can show interaction for event " + this.state.testEventForInteraction + "?: " + canShowInteraction)
                }).catch( (error) => {
                  console.log("APPTENTIVE TEST: Error determining if an interaction can be shown for event " + this.state.testEventForInteraction + ": ", error)
                })

              }}
              title="Print Test"
            />
          </View>

          {/* Test Message Center */}
          <View style={[styles.container, { flexDirection: "row" }]}>
            <Button
              onPress={() => {
                Apptentive.canShowMessageCenter().then( (canShowMessageCenter) => {
                  console.log("APPTENTIVE TEST: Can show message center?: " + canShowMessageCenter)
                }).catch( (error) => {
                  console.log("APPTENTIVE TEST: Error determining if message center can be shown: ", error)
                })

              }}
              title="Print Can Show MC"
            />
            <Button
              onPress={() => {
                Apptentive.showMessageCenter()
              }}
              title="Launch Message Center"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textinput: {
    flex: 3,
    height: 40,
    backgroundColor: 'floralwhite',
  }
});

export default App;
