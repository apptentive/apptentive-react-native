import { NativeModules, Platform, DeviceEventEmitter, NativeEventEmitter } from 'react-native';

const LINKING_ERROR =
  `The package 'apptentive-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

// Get the Apptentive Native Module
const ApptentiveModule = NativeModules.ApptentiveModule
  ? NativeModules.ApptentiveModule
  : new Proxy({},{ get() {
          throw new Error(LINKING_ERROR);
        },});

let _onUnreadMessageCountChanged = count => {};
let _eventsRegistered = false;

///// Class Implementation

export class ApptentiveConfiguration {

  apptentiveKey: string;
  apptentiveSignature: string;
  logLevel: string;
  distributionName: string;
  distributionVersion: string;

  constructor(key: string, signature: string) {
    this.apptentiveKey = key;
    this.apptentiveSignature = signature;
    this.logLevel = "info";
    this.distributionName = "React Native";
    this.distributionVersion = require("../package").version;
  }
}

export class Apptentive {
  
  // Register the Apptentive SDK
  static register(configuration: ApptentiveConfiguration): Promise<boolean> {
    if (!_eventsRegistered) {
      _eventsRegistered = true;

      const emitter = Platform.select({
        ios: () => new NativeEventEmitter(ApptentiveModule),
        android: () => DeviceEventEmitter
      })();
      
      emitter.addListener(ApptentiveModule.unreadMessageCountChangedEvent, (e) => {
        if (_onUnreadMessageCountChanged !== undefined) {
          _onUnreadMessageCountChanged(e.count);
        }
      });
    }
    
    return ApptentiveModule.register(configuration);
  }

  // Engage an event by an event name string
  static engage(event: string): Promise<boolean> {
    return ApptentiveModule.engage(event);
  }

  // Show the Message Center
  static showMessageCenter(): Promise<boolean> {
    return ApptentiveModule.showMessageCenter();
  }

  // Set person name
  static setPersonName(name: string): Promise<boolean> {
    return ApptentiveModule.setPersonName(name);
  }

  // Get person name
  static getPersonName(): Promise<string> {
    return ApptentiveModule.getPersonName();
  }

  // Set person email
  static setPersonEmail(email: string): Promise<boolean> {
    return ApptentiveModule.setPersonEmail(email);
  }

  // Get person name
  static getPersonEmail(): Promise<string> {
    return ApptentiveModule.getPersonEmail();
  }

  // Add person custom data based on key string and value of type bool, number, or string
  static addCustomPersonData(key: string, value: any): Promise<boolean> {
    return ApptentiveModule.addCustomPersonData(key, value);
  }

  // Remove person custom data based on key string
  static removeCustomPersonData(key: string): Promise<boolean> {
    return ApptentiveModule.removeCustomPersonData(key);
  }

  // Add device custom data based on key string and value of type bool, number, or string
  static addCustomDeviceData(key: string, value: any): Promise<boolean> {
    return ApptentiveModule.addCustomDeviceData(key, value);
  }

  // Remove device custom data based on key string
  static removeCustomDeviceData(key: string): Promise<boolean> {
    return ApptentiveModule.removeCustomDeviceData(key);
  }

  // Check if an event name will launch an interaction
  static canShowInteraction(event: string): Promise<boolean> {
    return ApptentiveModule.canShowInteraction(event);
  }

  // Check if Message Center can be shown
  static canShowMessageCenter(): Promise<boolean> {
    return ApptentiveModule.canShowMessageCenter();
  }

  // Get unread message count in Message Center
  static getUnreadMessageCount(): Promise<number> {
    return ApptentiveModule.getUnreadMessageCount();
  }
  
  /**
   * @return Current callback for the unread message count change in the Message Center.
   */
  static get onUnreadMessageCountChanged() {
    return _onUnreadMessageCountChanged;
  }

  /**
   * Sets current callback for the unread message count change in the Message Center.
   * @param value Callback function with a single integer parameter.
   */
  static set onUnreadMessageCountChanged(value) {
    _onUnreadMessageCountChanged = value;
  }
  
}
