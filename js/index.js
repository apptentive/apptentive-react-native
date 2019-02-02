
import { NativeModules } from 'react-native';
import { ApptentivePlatformSpecific } from './platform-specific';

const { RNApptentiveModule } = NativeModules;

export class ApptentiveConfiguration {
  constructor(apptentiveKey, apptentiveSignature) {
    this.apptentiveKey = apptentiveKey;
    this.apptentiveSignature = apptentiveSignature;
    this.logLevel = 'info';
    this.shouldSanitizeLogMessages = true;
    this.shouldEncryptStorage = false;
  }
  toString() {
    return `(apptentiveKey=${this.apptentiveKey}, apptentiveSignature=${this.apptentiveSignature}, logLevel=${this.logLevel}, shouldSanitizeLogMessages=${this.shouldSanitizeLogMessages}, shouldEncryptStorage=${this.shouldEncryptStorage})`;
  }
}

let _eventsRegistered = false;
let _onUnreadMessageCountChanged = function onUnreadMessageCountChanged(count) {};
let _onAuthenticationFailed = function onAuthenticationFailed(reason) {};

export class Apptentive {
  /**
   * Initializes Apptentive instance with a given configuration.
   * @return Promise
   */
  static register(apptentiveConfiguration) {
    if (!_eventsRegistered) {
      _eventsRegistered = true;

      // unread message count
      const emitter = ApptentivePlatformSpecific.createApptentiveEventEmitter(RNApptentiveModule);
      emitter.addListener('onUnreadMessageCountChanged', (e) => {
        if (_onUnreadMessageCountChanged !== undefined) {
          _onUnreadMessageCountChanged(e.count);
        }
      });

      // auth failure callback
      emitter.addListener('onAuthenticationFailed', (e) => {
        if (_onAuthenticationFailed !== undefined) {
          _onAuthenticationFailed(e.reason);
        }
      });
    }
    return RNApptentiveModule.register(apptentiveConfiguration);
  }

  /**
   * Presents Message Center.
   * @param customData An optional dictionary of key/value pairs to be associated with the event.
   * @return Promise with success boolean or error.
   */
  static presentMessageCenter(customData = null) {
    return RNApptentiveModule.presentMessageCenter(customData);
  }

  // TODO: unread message count

  /**
   * Checks if Message Center will be displayed when `presentMessageCenter` is called.
   * @return Promise with boolean flag or error.
   */
  static canShowMessageCenter() {
    return RNApptentiveModule.canShowMessageCenter();
  }

  /**
   * Checks whether the given event will cause an Interaction to be shown.
   * @return Promise with boolean flag or error.
   */
  static canShowInteraction(event) {
    return RNApptentiveModule.canShowInteraction(event);
  }

  /**
   * Shows interaction UI, if applicable, related to a given event, and attaches the specified custom data to the event.
   * @param event A string representing the name of the event.
   * @param customData An optional dictionary of key/value pairs to be associated with the event.
   * @return Promise with boolean flag or error.
   */
  static engage(event, customData = null) {
    return RNApptentiveModule.engage(event, customData);
  }

  // TODO: extended data

  /**
   * @return Promise with person name or error.
   */
  static getPersonName() {
    return RNApptentiveModule.getPersonName();
  }

  /**
   * Sets person name.
   * @param value New person name.
   * @return Promise with boolean flag or error.
   */
  static setPersonName(value) {
    return RNApptentiveModule.setPersonName(value);
  }

  /**
   * @return Promise with person email or error.
   */
  static getPersonEmail() {
    return RNApptentiveModule.getPersonEmail();
  }

  /**
   * Sets person email.
   * @param value New person email.
   * @return Promise with boolean flag or error.
   */
  static setPersonEmail(value) {
    return RNApptentiveModule.setPersonEmail(value);
  }

  /**
   * Adds custom data associated with the current person.
   * @param key String key for the data.
   * @param value Value for the data (must be string, number or boolean)
   * @return Promise with boolean flag or error.
   */
  static addCustomPersonData(key, value) {
    if (value !== null && value !== undefined) {
      const type = typeof value;
      if (type === 'string') {
        return RNApptentiveModule.addCustomPersonDataString(key, value);
      } else if (type === 'number') {
        return RNApptentiveModule.addCustomPersonDataNumber(key, ApptentivePlatformSpecific.exportNumber(value));
      } else if (type === 'boolean') {
        return RNApptentiveModule.addCustomPersonDataBool(key, value);
      }
    }
    return Promise.reject(new Error('Your value should be either a string, number or bool'));
  }

  /**
   * Removes custom data associated with the current person.
   * @param key String key for the data.
   * @return Promise with boolean flag or error.
   */
  static removeCustomPersonData(key) {
    return RNApptentiveModule.removeCustomPersonData(key);
  }

  /**
   * Adds custom data associated with the current device.
   * @param key String key for the data.
   * @param value Value for the data (must be string, number or boolean)
   * @return Promise with boolean flag or error.
   */
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
    return Promise.reject(new Error('Your value should be either a string, number or bool'));
  }

  /**
   * Removes custom data associated with the current device.
   * @param key String key for the data.
   * @return Promise with boolean flag or error.
   */
  static removeCustomDeviceData(key) {
    return RNApptentiveModule.removeCustomDeviceData(key);
  }

  /**
   * Logs the specified user in, using the value of the proof parameter to
   * ensure that the login attempt is authorized.
   * @param token An authorization token.
   * @return Promise with boolean flag or error.
   */
  static logIn(token) {
    return RNApptentiveModule.logIn(token);
  }

  /**
   * Ends the current user session. The user session will be persisted in a logged-out state
   * so that it can be resumed using the logIn method.
   * @return Promise with boolean flag or error.
   */
  static logOut() {
    return RNApptentiveModule.logOut();
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

  /**
   * @return Current callback for the authentication failures.
   */
  static get onAuthenticationFailed() {
    return _onAuthenticationFailed;
  }

  /**
   * Sets current callback for the authentication failures.
   * @param value Callback function with a single string parameter.
   */
  static set onAuthenticationFailed(value) {
    _onAuthenticationFailed = value;
  }
}

module.exports = {
  Apptentive,
  ApptentiveConfiguration,
};
