import { DeviceEventEmitter } from 'react-native';

export class ApptentivePlatformSpecific {
  static createApptentiveEventEmitter(nativeModule) {
    return DeviceEventEmitter;
  }

  /** We need to serialize number to a string in order to retain the precision -
   * Android library would automatically cast values to Integer.
   */
  static exportNumber(value) {
    return value.toString();
  }
}

module.exports = {
  ApptentivePlatformSpecific,
};
