
import { NativeModules } from 'react-native';
const { RNApptentiveModule } = NativeModules;

export default class ApptentiveConfiguration {
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

/**
 * Initializes Apptentive instance with a given configuration.
 * @return Promise
 */
function register(apptentiveConfiguration) {
  return init(ApptentiveModule, apptentiveConfiguration);
}

/**
 * Presents Message Center modally from the specified view controller.
 * @param customData An optional dictionary of key/value pairs to be associated with the event.
 * @return Promise with success boolean or error.
 */
function presentMessageCenter(customData = null) {
  return ApptentiveModule.presentMessageCenter();
}

/**
 * Shows interaction UI, if applicable, related to a given event, and attaches the specified custom data to the event.
 * @param event A string representing the name of the event.
 * @param customData An optional dictionary of key/value pairs to be associated with the event.
 */
function engageEvent(event, customData = null) {
  return ApptentiveModule.engageEvent(event);
}

export default RNApptentiveModule;
