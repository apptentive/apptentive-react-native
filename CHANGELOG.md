# Apptentive React Native Changelog

This document lets you know what has changed in the React Native module. For changes in each version of the native SDKs, please see:

- [Android Changelog](https://github.com/apptentive/apptentive-kit-android/blob/master/CHANGELOG.md)
- [iOS Changelog](https://github.com/apptentive/apptentive-kit-ios/blob/main/CHANGELOG.md)

# 2024-04-24 - v6.7.0

- Apptentive Android SDK: 6.7.0
- Apptentive iOS SDK: 6.7.0

# 2023-08-02 - v6.1.3

- Apptentive Android SDK: 6.1.0
- Apptentive iOS SDK: 6.2.2

# 2023-04-26 - v6.1.2

- Apptentive Android SDK: 6.0.4
- Apptentive iOS SDK: 6.2.0

#### Bugs Fixed

- Added a check to avoid treating 0 and 1 as boolean values for custom data. 

# 2023-03-13 - v6.1.1

- Apptentive Android SDK: 6.0.3
- Apptentive iOS SDK: 6.1.0

# 2023-02-14 - v6.1.0

- Apptentive Android SDK: 5.8.4
- Apptentive iOS SDK: 6.1.0

# 2023-02-02 - v6.0.9

- Apptentive Android SDK: 5.8.4
- Apptentive iOS SDK: 6.0.9

# 2022-09-28 - v6.0.3

- Apptentive Android SDK: 5.8.4
- Apptentive iOS SDK: 6.0.4

# 2022-07-20 - v6.0.2

- Apptentive Android SDK: 5.8.3
- Apptentive iOS SDK: 6.0.3

#### Bugs Fixed

- Fixed typescript functionality in published package

# 2022-06-09 - v6.0.1

- Apptentive Android SDK: 5.8.3
- Apptentive iOS SDK: 6.0.2

#### Bugs Fixed

- Added missing lifecycle callbacks for the Android platform

# 2022-05-16 - v6.0.0

- Apptentive Android SDK: 5.8.3
- Apptentive iOS SDK: 6.0.2

#### New & Improved

This release updates the iOS dependency to the new ApptentiveKit v6.0 SDK.

#### Migration Notes

- For most developers this should be a transparent migration with no additional steps
- Login/logout (Client Authentication) is not supported in this release
- Customizing Survey and Message Center interactions on iOS requires native code in this release (see our [iOS customization guide](https://learn.apptentive.com/knowledge-base/apptentive-kit-ios-customization/))

# 2022-03-23 - v5.8.3

- Apptentive Android SDK: 5.8.3
- Apptentive iOS SDK: 5.3.4

# 2022-01-10 - v5.8.0

- Apptentive Android SDK: 5.8.0
- Apptentive iOS SDK: 5.3.4

# 2021-11-10 - v5.7.3

- Added missing configuration flags
- Apptentive Android SDK: 5.7.1
- Apptentive iOS SDK: 5.3.4

# 2021-08-26 - v5.7.2

- Apptentive Android SDK: 5.7.1
- Apptentive iOS SDK: 5.3.4

# 2021-08-10 - v5.7.1

- Fixed behavior of Google Play Review Dialog for uncoupled rating interactions.
- Apptentive Android SDK: 5.7.0
- Apptentive iOS SDK: 5.3.4

# 2021-08-04 - v5.7.0

- Apptentive Android SDK: 5.7.0
- Apptentive iOS SDK: 5.3.4

# 2021-07-28 - v5.6.5

- Apptentive Android SDK: 5.6.4
- Apptentive iOS SDK: 5.3.3

# 2021-07-07 - v5.6.4

- Apptentive Android SDK: 5.6.3
- Apptentive iOS SDK: 5.3.3

# 2021-02-02 - v5.6.3

- Apptentive Android SDK: 5.6.2
- Apptentive iOS SDK: 5.3.1

# 2020-10-22 - v5.6.2

- Apptentive Android SDK: 5.6.1
- Apptentive iOS SDK: 5.3.1

# 2020-10-22 - v5.6.1

- Fixed missing iOS header file.
- Apptentive Android SDK: 5.6.0
- Apptentive iOS SDK: 5.3.1

# 2020-09-28 - v5.6.0

- Apptentive Android SDK: 5.6.0
- Apptentive iOS SDK: 5.3.1

# 2020-09-15 - v5.5.5

- Fixed a crashing bug in Surveys for projects built with Xcode 12 and run on iOS 14.
- Increased iOS deployment target to version 10.3
- Apptentive Android SDK: 5.5.4
- Apptentive iOS SDK: 5.3.0

# 2020-09-08 - v5.5.4

- Fixed Android 11 support.
- Apptentive Android SDK: 5.5.4
- Apptentive iOS SDK: 5.2.14

# 2020-09-04 - v5.5.3

- Android 11 support.
- Apptentive Android SDK: 5.5.4
- Apptentive iOS SDK: 5.2.14

# 2020-08-07 - v5.5.2

- iOS module now resolves promises for methods that don't return a value.
- Apptentive Android SDK: 5.5.3
- Apptentive iOS SDK: 5.2.14

# 2020-07-08 - v5.5.1

- Apptentive Android SDK: 5.5.3
- Apptentive iOS SDK: 5.2.14

# 2019-11-14 - v5.5.0

- Fixed React Native `0.60.+` incompatibility on Android. For more information: https://learn.apptentive.com/knowledge-base/react-native-integration-reference/#migrating-from-support-library-to-androidx
- Apptentive Android SDK: 5.5.0
- Apptentive iOS SDK: 5.2.7

# 2019-11-05 - v5.4.6

- Fixed `podspec` file for 0.60-style auto-linking.
- Apptentive Android SDK: 5.4.7
- Apptentive iOS SDK: 5.2.7

# 2019-11-05 - v5.4.5

- Added `podspec` file and updated iOS header path for 0.60-style auto-linking.
- Apptentive Android SDK: 5.4.7
- Apptentive iOS SDK: 5.2.7

# 2019-10-29 - v5.4.4

- Fixed `android` crash while configuration changes.
- Apptentive Android SDK: 5.4.7
- Apptentive iOS SDK: 5.2.7

# 2019-06-21 - v5.4.3

- Fix missing `ios` and `android` directories

# 2019-05-17 - v5.4.2

- Added TypeScript definitions
- Apptentive Android SDK: 5.4.2
- Apptentive iOS SDK: 5.2.4

# 2019-02-01 - v5.4.1

- Added ability to control Android SDK encrypted storage
- Apptentive Android SDK: 5.4.0
- Apptentive iOS SDK: 5.2.3

# 2019-01-29 - v5.4.0

- Apptentive Android SDK: 5.4.0
- Apptentive iOS SDK: 5.2.3

# 2018-10-29 - v5.3.2

- Apptentive Android SDK: 5.3.3
- Apptentive iOS SDK: 5.2.3

# 2018-10-29 - v5.3.1

- Apptentive Android SDK: 5.3.2
- Apptentive iOS SDK: 5.2.2

# 2018-09-14 - v5.3.0

- Apptentive Android SDK: 5.3.1
- Apptentive iOS SDK: 5.2.1

# 2018-09-14 - v5.2.0

- Allow registration of iOS SDK from native code
- Apptentive Android SDK: 5.3.0
- Apptentive iOS SDK: 5.2.0

# 2018-08-15 - v5.1.4

- Fixed Android build issues
- Improved configuration handling

# 2018-07-26 - v5.1.3

- Fix check for registered status on iOS

# 2018-07-26 - v5.1.2

- Fix missing dependency in podspec

# 2018-07-24 - v5.1.1

- Add podspec for projects integrating React via (deprecated) CocoaPod
- Apptentive Android SDK: 5.1.5
- Apptentive iOS SDK: 5.1.2

# 2018-05-14 - v5.1.0

- Apptentive Android SDK: 5.1.0
- Apptentive iOS SDK: 5.1.0

# 2018-03-30 - v5.0.0

- Apptentive Android SDK: 5.0.4
- Apptentive iOS SDK: 5.0.3
