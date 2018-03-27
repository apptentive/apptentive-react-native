import { NativeEventEmitter } from 'react-native';

export class ApptentivePlatformSpecific {
  static createApptentiveEventEmitter(nativeModule) {
    return new NativeEventEmitter(nativeModule)
  }
}

module.exports = {
  ApptentivePlatformSpecific
}
