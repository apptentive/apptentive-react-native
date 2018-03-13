
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

export default RNApptentiveModule;
