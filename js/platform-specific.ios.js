import { NativeEventEmitter } from 'react-native';

export class ApptentivePlatformSpecific {
  static createApptentiveEventEmitter(nativeModule) {
    return new NativeEventEmitter(nativeModule);
  }

  static exportNumber(value) {
    return value;
  }
}

module.exports = {
  ApptentivePlatformSpecific,
};
