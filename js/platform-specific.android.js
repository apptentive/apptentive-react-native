import { DeviceEventEmitter } from 'react-native';

export class ApptentivePlatformSpecific {
  static createApptentiveEventEmitter(nativeModule) {
    return DeviceEventEmitter;
  }
}

module.exports = {
  ApptentivePlatformSpecific,
};
