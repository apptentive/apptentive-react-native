
import { NativeModules } from 'react-native';
import { ApptentivePlatformSpecific } from './platform-specific'

const { RNApptentiveModule } = NativeModules;

export class ApptentiveConfiguration {
  constructor(apptentiveKey, apptentiveSignature) {
    this.apptentiveKey = apptentiveKey;
    this.apptentiveSignature = apptentiveSignature;
    this.logLevel = 'info';
    this.shouldSanitizeLogMessages = true;
  }
  toString() {
    return `(apptentiveKey=${this.apptentiveKey}, apptentiveSignature=${this.apptentiveSignature}, logLevel=${this.logLevel}, shouldSanitizeLogMessages=${shouldSanitizeLogMessages})`;
  }
}

let _eventsRegistered = false;
let _onUnreadMessageChange = function(count) {};

export class Apptentive {
  /**
   * Initializes Apptentive instance with a given configuration.
   * @return Promise
   */
  static register(apptentiveConfiguration) {
    if (!_eventsRegistered) {
      _eventsRegistered = true;

      // unread message count
      const emitter = ApptentivePlatformSpecific.createApptentiveEventEmitter(RNApptentiveModule)
      emitter.addListener('onUnreadMessageChange', function(e: Event) {
        if (_onUnreadMessageChange !== undefined) {
          _onUnreadMessageChange(e.count);
        }
      });
      // TODO: auth callbacks
    }
    return RNApptentiveModule.register(apptentiveConfiguration);
  }

  /**
   * Presents Message Center modally from the specified view controller.
   * @param customData An optional dictionary of key/value pairs to be associated with the event.
   * @return Promise with success boolean or error.
   */
  static presentMessageCenter(customData = null) {
    return RNApptentiveModule.presentMessageCenter(customData);
  }

  // TODO: unread message count

  static canShowMessageCenter() {
    return RNApptentiveModule.canShowMessageCenter();
  }

  static canShowInteraction(event) {
    return RNApptentiveModule.canShowInteraction(event);
  }

  /**
   * Shows interaction UI, if applicable, related to a given event, and attaches the specified custom data to the event.
   * @param event A string representing the name of the event.
   * @param customData An optional dictionary of key/value pairs to be associated with the event.
   */
  static engage(event, customData = null) {
    return RNApptentiveModule.engage(event, customData);
  }

  // TODO: extended data

  static getPersonName() {
    return RNApptentiveModule.getPersonName();
  }

  static setPersonName(value) {
    return RNApptentiveModule.setPersonName(value);
  }

  static getPersonEmail() {
    return RNApptentiveModule.getPersonEmail();
  }

  static setPersonEmail(value) {
    return RNApptentiveModule.setPersonEmail(value);
  }

  static addCustomPersonData(key, value) {
    if (value !== null && value !== undefined) {
      const type = typeof value;
      if (type === 'string') {
        return RNApptentiveModule.addCustomPersonDataString(key, value);
      } else if (type === 'number') {
        return RNApptentiveModule.addCustomPersonDataNumber(key, value);
      } else if (type === 'boolean') {
        return RNApptentiveModule.addCustomPersonDataBool(key, value);
      }
    }
    return Promise.reject("Your value should be either a string, number or bool")
  }

  static removeCustomPersonData(key) {
    return RNApptentiveModule.removeCustomPersonData(key);
  }

  static addCustomDeviceData(key, value) {
    if (value !== null && value !== undefined) {
      const type = typeof value;
      if (type === 'string') {
        return RNApptentiveModule.addCustomDeviceDataString(key, value);
      } else if (type === 'number') {
        return RNApptentiveModule.addCustomDeviceDataNumber(key, value);
      } else if (type === 'boolean') {
        return RNApptentiveModule.addCustomDeviceDataBool(key, value);
      }
    }
    return Promise.reject("Your value should be either a string, number or bool")
  }

  static removeCustomDeviceData(key) {
    return RNApptentiveModule.removeCustomDeviceData(key);
  }

  // TODO: login/logout

  // TODO: push support

  static get onUnreadMessageChange() {
    return _onUnreadMessageChange;
  }

  static set onUnreadMessageChange(value) {
    _onUnreadMessageChange = value;
  }
}

module.exports = {
  Apptentive,
  ApptentiveConfiguration
}
